'use strict'

class PurchaseUpdate {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      game_id: 'required',
      betnumbers: 'required',
      price: 'required'
    }
  }
}

module.exports = PurchaseUpdate
