'use strict'

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
}

module.exports = Purchase
