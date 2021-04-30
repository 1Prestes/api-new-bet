'use strict'

const Kue = use('Kue')
const Job = use('App/Jobs/NewUserMail')

const MailHook = (exports = module.exports = {})

MailHook.sendMailNewUser = async mailInstance => {
  const { email, username } = mailInstance

  Kue.dispatch(Job.key, { email, username }, { attempts: 3 })
}
