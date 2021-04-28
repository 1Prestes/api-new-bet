'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('sessions', 'SessionController.store')

Route.resource('passwords', 'ForgotPasswordController').only([
  'store',
  'update'
])

Route.post('users', 'UserController.store')

Route.group(() => {
  Route.resource('users', 'UserController').only([
    'index',
    'show',
    'update',
    'destroy'
  ])

  Route.post('games', 'GameController.store')
  Route.get('games', 'GameController.index')

  Route.resource('users.purchases', 'PurchaseController').apiOnly()
}).middleware(['auth'])
