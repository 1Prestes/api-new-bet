'use strict'

class SessionController {
  async store ({ request, response, auth }) {
    try {
      const { email, password } = request.all()

      const token = await auth.attempt(email, password)

      return token
    } catch (error) {
      return response.status(error.status).send({
        error: {
          message: error.message
        }
      })
    }
  }
}

module.exports = SessionController
