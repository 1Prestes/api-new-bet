'use strict'

const Antl = use('Antl')

class Game {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      type: 'required',
      description: 'required',
      range: 'required',
      price: 'required',
      max_number: 'required',
      color: 'required',
      min_cart_value: 'required'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Game
