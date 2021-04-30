'use strict'

const moment = require('moment')
const crypto = require('crypto')
const User = use('App/Models/User')

const Kue = use('Kue')
const Job = use('App/Jobs/ForgotPasswordMail')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      const email = request.input('email')
      const user = await User.findByOrFail('email', email)

      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()

      await user.save()

      Kue.dispatch(
        Job.key,
        {
          email: user.email,
          redirectUrl: request.input('redirect_url'),
          token: user.token
        },
        { attempts: 3 }
      )
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'Deu ruim! email não encontrado.' } })
    }
  }

  async update ({ request, response }) {
    try {
      const { token, password } = request.all()
      const user = await User.findByOrFail('token', token)

      const tokenExpired = moment()
        .subtract('2', 'days')
        .isAfter(user.token_created_at)

      if (tokenExpired) {
        return response
          .status(401)
          .send({ error: { message: 'Token expired' } })
      }

      user.token = null
      user.token_created_at = null
      user.password = password

      await user.save()
    } catch (error) {
      return response.status(error.status).send({
        error: { message: 'Deu ruim! não foi possivel resetar sua senha.' }
      })
    }
  }
}

module.exports = ForgotPasswordController
