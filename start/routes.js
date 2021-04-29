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
  Route.resource('users', 'UserController')
    .only(['index', 'show', 'update', 'destroy'])
    .validator(new Map([[['users.update'], ['UserUpdate']]]))

  Route.resource('games', 'GameController')
    .apiOnly()
    .validator(
      new Map([
        [['games.store'], ['Game']],
        [['games.update'], ['Game']]
      ])
    )

  Route.resource('users.purchases', 'PurchaseController')
    .apiOnly()
    .validator(new Map([[['users.purchases.update'], ['PurchaseUpdate']]]))
}).middleware(['auth'])
