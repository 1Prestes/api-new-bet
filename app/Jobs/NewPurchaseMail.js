'use strict'

const Mail = use('Mail')

class NewPurchaseMail {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key () {
    return 'NewPurchaseMail-job'
  }

  // This is where the work is done.
  async handle ({ email, username, data, totalValue }) {
    await Mail.send(
      ['emails.new_bet', 'emails.new_bet-text'],
      { username, data, totalValue },
      message => {
        message
          .to(email)
          .from('admin@newbet.com', 'Admin | New Bet')
          .subject('Welcome to New Bet')
      }
    )
  }
}

module.exports = NewPurchaseMail
