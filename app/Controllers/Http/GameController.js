'use strict'

const Game = use('App/Models/Game')

class GameController {
  async index ({ request, response, view }) {
    const games = await Game.all()

    return games
  }

  async store ({ request, response }) {
    const data = request.only([
      'type',
      'description',
      'range',
      'price',
      'max_number',
      'color',
      'min_cart_value'
    ])
    const game = await Game.create(data)

    return game
  }

  async show ({ params }) {
    const game = await Game.findByOrFail('id', params.id)

    return game
  }

  async update ({ params, request, response }) {
    try {
      const game = await Game.findByOrFail('id', params.id)

      if (game) {
        const data = request.only([
          'type',
          'description',
          'range',
          'price',
          'max_number',
          'color',
          'min_cart_value'
        ])

        game.merge(data)
        await game.save()
      }

      return game
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'Game not found' } })
    }
  }

  async destroy ({ params, response }) {
    try {
      const game = await Game.findByOrFail('id', params.id)

      await game.delete()
    } catch (error) {
      let message = 'Something went wrong. Try again or contact us'
      if (error.status === 404) message = 'Game not found.'

      return response.status(error.status).send({
        error: {
          message
        }
      })
    }
  }
}

module.exports = GameController
