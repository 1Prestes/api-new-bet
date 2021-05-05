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

Route.post('sessions', 'SessionController.store').validator('Session')

Route.post('passwords', 'ForgotPasswordController.store').validator(
  'ForgotPassword'
)
Route.put('passwords', 'ForgotPasswordController.update').validator(
  'ResetPassword'
)

Route.post('users', 'UserController.store').validator('User')

Route.group(() => {
  Route.get('users', 'UserController.index')
  Route.get('users/user', 'UserController.show')
  Route.put('users', 'UserController.update').validator('UserUpdate')
  Route.delete('users', 'UserController.destroy')

  Route.resource('games', 'GameController')
    .apiOnly()
    .validator(
      new Map([
        [['games.store'], ['Game']],
        [['games.update'], ['Game']]
      ])
    )

  Route.get('users/purchases', 'PurchaseController.index')
  Route.get('users/purchase', 'PurchaseController.show')
  Route.post('users/purchases', 'PurchaseController.store')
  Route.put('users/purchases', 'PurchaseController.update').validator('PurchaseUpdate')
  Route.delete('users/purchases', 'PurchaseController.destroy')
}).middleware(['auth'])
