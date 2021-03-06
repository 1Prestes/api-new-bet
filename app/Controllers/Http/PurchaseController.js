'use strict'

const Kue = use('Kue')
const Job = use('App/Jobs/NewPurchaseMail')
const Purchase = use('App/Models/Purchase')
const Game = use('App/Models/Game')

function hasDuplicatedNumber (array) {
  const numbers = new Set()
  array.map(num => numbers.add(Number(num)))

  return numbers.size !== array.length
}

function formattedNumbers (array) {
  const numbers = array.map(number => (number < 10 ? '0' + number : number))

  return numbers
    .toString()
    .split(',')
    .join(', ')
}

class PurchaseController {
  async index ({ response, auth }) {
    try {
      const purchases = await Purchase.query()
        .where('user_id', auth.user.id)
        .fetch()

      return purchases
    } catch (error) {
      return response.status(error.status).send({
        error: {
          message: error.message
        }
      })
    }
  }

  async store ({ request, response, auth }) {
    const data = request.input('bet')
    const games = (await Game.all()).toJSON()
    const templateMail = {}
    let totalValue = 0

    try {
      for (let i = 0; i < data.length; i++) {
        const betNumbers = data[i].betnumbers.split(',')
        const currentGameType = games.filter(
          game => game.id === data[i].game_id
        )

        if (betNumbers.length !== currentGameType[0].max_number) {
          return response.status(406).send({
            error: {
              message: `the game (${betNumbers}) is not compatible with type ${currentGameType[0].type}.`
            }
          })
        }

        if (hasDuplicatedNumber(betNumbers)) {
          return response.status(406).send({
            error: {
              message: `the game (${betNumbers}) contains duplicate numbers.`
            }
          })
        }

        if (!templateMail[currentGameType[0].type]) {
          templateMail[currentGameType[0].type] = {
            type: currentGameType[0].type,
            numbers: [formattedNumbers(betNumbers)],
            price: currentGameType[0].price,
            color: currentGameType[0].color
          }
        } else {
          templateMail[currentGameType[0].type] = {
            ...templateMail[currentGameType[0].type],
            numbers: [
              ...templateMail[currentGameType[0].type].numbers,
              formattedNumbers(betNumbers)
            ],
            price:
              templateMail[currentGameType[0].type].price +
              currentGameType[0].price
          }
        }

        totalValue += currentGameType[0].price
        data[i].user_id = auth.user.id
        data[i].price = currentGameType[0].price
      }

      const purchase = await Purchase.createMany(data)
      const user = await auth.getUser()

      Kue.dispatch(
        Job.key,
        {
          email: user.email,
          username: user.username,
          data: templateMail,
          totalValue: totalValue
        },
        { attempts: 3 }
      )
      return purchase
    } catch (error) {
      return error
    }
  }

  async show ({ request, response, auth }) {
    try {
      const { id } = request.only(['id'])
      const purchase = await Purchase.findByOrFail({
        id: id,
        user_id: auth.user.id
      })

      return purchase
    } catch (error) {
      let message = 'Something went wrong. Try again or contact us'
      if (error.status === 404) message = 'Purchase not found.'

      return response.status(error.status).send({
        error: {
          message
        }
      })
    }
  }

  async update ({ request, response, auth }) {
    try {
      const { id } = request.only(['id'])
      const purchase = await Purchase.findByOrFail({
        id: id,
        user_id: auth.user.id
      })

      const data = request.only(['game_id', 'betnumbers', 'price'])

      purchase.merge(data)

      await purchase.save()

      return purchase
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'Bet not found' } })
    }
  }

  async destroy ({ request, response, auth }) {
    try {
      const { id } = request.only(['id'])
      const purchase = await Purchase.findByOrFail({
        id: id,
        user_id: auth.user.id
      })

      await purchase.delete()
    } catch (error) {
      let message = 'Something went wrong. Try again or contact us'
      if (error.status === 404) message = 'Purchase not found.'

      return response.status(error.status).send({
        error: {
          message
        }
      })
    }
  }
}

module.exports = PurchaseController
