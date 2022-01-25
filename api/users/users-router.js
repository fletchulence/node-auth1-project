// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!
const router = require('express').Router()

const User = require('./users-model')

/**
  [GET] /api/users

  This endpoint is RESTRICTED: only authenticated clients
  should have access.

  response:
  status 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]

  response on non-authenticated:
  status 401
  {
    "message": "You shall not pass!"
  }
 */

  router.get('/', async (req, res, next)=>{
    try{
      res.json( await User.find() )
    }catch(err){
      next(err)
    }
  })


// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router