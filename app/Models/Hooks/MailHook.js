'use strict'

const Mail = use('Mail')

const MailHook = (exports = module.exports = {})

MailHook.sendMailNewUser = async mailInstance => {
  await Mail.send(
    ['emails.welcome', 'emails.welcome-text'],
    { username: mailInstance.username },
    message => {
      message
        .to(mailInstance.email)
        .from('admin@newbet.com', 'Admin | New Bet')
        .subject('Welcome to New Bet')
    }
  )
}

MailHook.sendMailOnForgotPassword = async mailInstance => {
  console.log(mailInstance)
  console.log(mailInstance.dirty)
  // console.log(mailInstance.input('redirect_url'))
  // await Mail.send(
  //   ['emails.forgot_password', 'emails.forgot_password-text'],
  //   { link: `${request.input('redirect_url')}?token=${user.token}` },
  //   message => {
  //     message
  //       .to(user.email)
  //       .from('admin@newbet.com', 'Admin | New Bet')
  //       .subject('Forgot Password')
  //   }
  // )
}
