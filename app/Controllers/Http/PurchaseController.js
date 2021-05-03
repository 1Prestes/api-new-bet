'use strict'

const Kue = use('Kue')
const Job = use('App/Jobs/NewPurchaseMail')
const Purchase = use('App/Models/Purchase')
const Database = use('Database')

class PurchaseController {
  async index ({ params, request, response }) {
    try {
      const gameId = request.input('game_id')
      let myQuery = { user_id: params.users_id }

      if (gameId) myQuery = { ...myQuery, game_id: gameId }

      const purchases = await Purchase.query()
        .where(myQuery)
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
    const games = await Database.table('games').select('*')
    let error = false

    function hasDuplicatedNumber (array) {
      const numbers = new Set()
      array.map(num => numbers.add(Number(num)))

      return numbers.size !== array.length
    }

    data.map(dt => {
      const betNumbers = dt.betnumbers.split(',')
      const currentGameType = games.filter(game => game.id === dt.game_id)

      if (betNumbers.length !== currentGameType[0].max_number) {
        error = true
        return response.status(406).send({
          error: {
            message: `the game (${betNumbers}) is not compatible with type ${currentGameType[0].type}.`
          }
        })
      }

      if (hasDuplicatedNumber(betNumbers)) {
        error = true
        return response.status(406).send({
          error: {
            message: `the game (${betNumbers}) contains duplicate numbers.`
          }
        })
      }
    })

    if (error) return

    const purchase = await Purchase.createMany(data)
    const user = await auth.getUser()

    Kue.dispatch(
      Job.key,
      {
        email: user.email,
        username: user.username
      },
      { attempts: 3 }
    )

    return purchase
  }

  async show ({ params }) {
    try {
      const purchase = await Purchase.query()
        .where({
          id: params.id,
          user_id: params.users_id
        })
        .fetch()

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

  async update ({ params, request, response }) {
    try {
      const purchase = await Purchase.findByOrFail({
        id: params.id,
        user_id: params.users_id
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

  async destroy ({ params, response }) {
    try {
      const purchase = await Purchase.findOrFail(params.id)

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
