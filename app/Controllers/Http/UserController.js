'use strict'

const User = use('App/Models/User')

class UserController {
  async index ({ response }) {
    try {
      const users = await User.all()

      return users
    } catch (error) {
      return response.status(error.status).send({
        error: {
          message
        }
      })
    }
  }

  async show ({ params, response }) {
    try {
      const user = await User.findOrFail(params.id)

      return user
    } catch (error) {
      let message = 'Something went wrong. Try again or contact us'
      if (error.status === 404) message = 'User not found.'

      return response.status(error.status).send({
        error: {
          message
        }
      })
    }
  }

  async store ({ request }) {
    try {
      const data = request.only(['username', 'email', 'password'])
      const user = await User.create(data)

      return user
    } catch (error) {
      return response.status(error.status).send({
        error: {
          message: error.message
        }
      })
    }
  }

  async update ({ params, request, response }) {
    try {
      const user = await User.firstOrFail(params.id)
      const data = request.only(['username', 'email', 'password'])
      user.merge(data)
      await user.save()

      return user
    } catch (error) {
      return response.status(error.status).send({
        error: {
          message: error.message
        }
      })
    }
  }

  async destroy ({ params, response }) {
    try {
      const user = await User.findOrFail(params.id)

      await user.delete()
    } catch (error) {
      let message = 'Something went wrong. Try again or contact us'
      if (error.status === 404) message = 'User not found.'

      return response.status(error.status).send({
        error: {
          message
        }
      })
    }
  }
}

module.exports = UserController
