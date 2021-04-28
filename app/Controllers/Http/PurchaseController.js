'use strict'

const Purchase = use('App/Models/Purchase')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with purchases
 */
class PurchaseController {
  /**
   * Show a list of all purchases.
   * GET purchases
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ params, request }) {
    const gameId = request.input('game_id')
    let myQuery = { user_id: params.users_id }

    if (gameId) myQuery = { ...myQuery, game_id: gameId }

    const purchases = await Purchase.query()
      .where(myQuery)
      .fetch()

    return purchases
  }

  /**
   * Create/save a new purchase.
   * POST purchases
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request }) {
    const data = request.input('bet')
    const purchase = await Purchase.createMany(data)

    return purchase
  }

  /**
   * Display a single purchase.
   * GET purchases/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    const purchase = await Purchase.query()
      .where({
        id: params.id,
        user_id: params.users_id
      })
      .fetch()

    return purchase
  }

  /**
   * Update purchase details.
   * PUT or PATCH purchases/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
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

  /**
   * Delete a purchase with id.
   * DELETE purchases/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params }) {
    const purchase = await Purchase.findOrFail(params.id)

    await purchase.delete()
  }
}

module.exports = PurchaseController
