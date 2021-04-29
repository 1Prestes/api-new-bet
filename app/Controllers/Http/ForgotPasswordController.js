'use strict'

const moment = require('moment')
const crypto = require('crypto')
const User = use('App/Models/User')
const Mail = use('Mail')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      const email = request.input('email')
      const user = await User.findByOrFail('email', email)

      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()

      await user.save()
      user.redirect_url = request.input('redirect_url')
      await Mail.send(
        ['emails.forgot_password', 'emails.forgot_password-text'],
        { link: `${request.input('redirect_url')}?token=${user.token}` },
        message => {
          message
            .to(user.email)
            .from('admin@newbet.com', 'Admin | New Bet')
            .subject('Forgot Password')
        }
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
