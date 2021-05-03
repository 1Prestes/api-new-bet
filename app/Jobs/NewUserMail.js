'use strict'

const Mail = use('Mail')

class NewUserMail {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key () {
    return 'NewUserMail-job'
  }

  // This is where the work is done.
  async handle ({ email, username }) {
    await Mail.send(
      ['emails.welcome', 'emails.welcome-text'],
      { username },
      message => {
        message
          .to(email)
          .from('admin@newbet.com', 'Admin | New Bet')
          .subject('Welcome to New Bet')
      }
    )
  }
}

module.exports = NewUserMail
