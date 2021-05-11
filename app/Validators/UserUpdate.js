'use strict'

const Antl = use('Antl')

class UserUpdate {
  get validateAll () {
    return true
  }

  get rules () {
    const userId = this.ctx.auth.user.id

    return {
      username: 'required',
      email: `unique:users,email,id,${userId}`,
      password: 'confirmed'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = UserUpdate
