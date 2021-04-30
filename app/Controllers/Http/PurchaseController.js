'use strict'

// const Kue = use('Kue')
const Purchase = use('App/Models/Purchase')
const Database = use('Database')

// const Job = use('App/Jobs/NewPurchaseMail')

class PurchaseController {
  async index ({ params, request }) {
    const gameId = request.input('game_id')
    let myQuery = { user_id: params.users_id }

    if (gameId) myQuery = { ...myQuery, game_id: gameId }

    const purchases = await Purchase.query()
      .where(myQuery)
      .fetch()

    return purchases
  }

  async store ({ request, response, auth }) {
    // const data = request.input('bet')
    const games = Database.table('games').select('*')
    console.log(games)
    console.log('sdfasdfasdfasdf')
    // data.map(async dt => {
    //   const bet = dt.betnumbers.split(',')
    //   if (bet.length === currentGame.max_number) {
    //     return console.log('show ', bet)
    //   } else {
    //     return response.send({ error: { message: 'jogo invalido' } })
    //   }
    // })

    // const purchase = await Purchase.createMany(data)
    // const user = await auth.getUser()

    // Kue.dispatch(
    //   Job.key,
    //   {
    //     email: user.email,
    //     username: user.username
    //   },
    //   { attempts: 3 }
    // )

    // return purchase
  }

  async show ({ params }) {
    const purchase = await Purchase.query()
      .where({
        id: params.id,
        user_id: params.users_id
      })
      .fetch()

    return purchase
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

  async destroy ({ params }) {
    const purchase = await Purchase.findOrFail(params.id)

    await purchase.delete()
  }
}

module.exports = PurchaseController
