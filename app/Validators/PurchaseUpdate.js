'use strict'

const Antl = use('Antl')

class PurchaseUpdate {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      id: 'required',
      game_id: 'required',
      betnumbers: 'required',
      price: 'required'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = PurchaseUpdate
