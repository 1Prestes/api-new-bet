'use strict'

const Game = use('App/Models/Game')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with games
 */
class GameController {
  /**
   * Show a list of all games.
   * GET games
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const games = await Game.all()

    return games
  }

  /**
   * Create/save a new game.
   * POST games
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
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

  /**
   * Display a single game.
   * GET games/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    const game = await Game.findByOrFail('id', params.id)

    return game
  }

  /**
   * Update game details.
   * PUT or PATCH games/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request }) {
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
  }

  /**
   * Delete a game with id.
   * DELETE games/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params }) {
    const game = await Game.findByOrFail('id', params.id)

    await game.delete()
  }
}

module.exports = GameController
