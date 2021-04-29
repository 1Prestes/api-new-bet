'use strict'

const Antl = use('Antl')

class Purchase {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      user_id: 'required',
      game_id: 'required',
      betnumbers: 'required',
      price: 'required'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Purchase
