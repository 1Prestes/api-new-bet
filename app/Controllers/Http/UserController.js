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
          message: error.message
        }
      })
    }
  }

  async show ({ response, auth }) {
    try {
      const user = await User.findByOrFail('id', auth.user.id)

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

  async store ({ request, response }) {
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

  async update ({ request, response, auth }) {
    try {
      const user = await User.findByOrFail('id', auth.user.id)
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
