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
  async index ({ params, request, response, view }) {
    const purchases = await Purchase.query()
      .where('user_id', params.user_id)
      .with('user')
      .fetch()

    return purchases
  }

  /**
   * Render a form to be used for creating a new purchase.
   * GET purchases/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {}

  /**
   * Create/save a new purchase.
   * POST purchases
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ params, request }) {
    const data = request.only(['game_id', 'betnumbers', 'price'])
    console.log(data)
    const purchase = await Purchase.create({
      ...data,
      user_id: params.users_id
    })

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
  async show ({ params, request, response, view }) {}

  /**
   * Render a form to update an existing purchase.
   * GET purchases/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {}

  /**
   * Update purchase details.
   * PUT or PATCH purchases/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {}

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
