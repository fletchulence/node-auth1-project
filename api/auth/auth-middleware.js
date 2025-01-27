const User = require('./../users/users-model')
const bcrypt = require('bcryptjs')


/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
  if(!req.session.user){
    next({ status:401 , message: 'you shall not pass!'})
  } else{
    next()
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  const { username } = req.body
  try{
    const [dbUser] = await User.findBy( {username} )
    if( dbUser ){
      next({ status: 422, message: 'Username taken' })
    } else {
      next()
    }
  } catch(err){
    next(err)
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/

//! keeping the below comments to test more
async function checkUsernameExists(req, res, next) {
  const { username, password } = req.body
  try{
    const [ existingUser ] = await User.findBy({ username })
    if( !existingUser ){
      next({ status: 401, message: 'Invalid credentials'})
    // } else if (existingUser && bcrypt.compareSync(password, existingUser.password)) {
    //   req.session.user = existingUser
    //   next()
    // } else{
    //   next({ status: 401, message: 'invalid credentials'})
    // }
    } else {
      next()
    }
  } catch(err){
    next(err)
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
  const { password } = req.body
  if( !password || password.length <= 3 ){
    next({ status: 422, message: "Password must be longer than 3 chars" })
  } else{
    next()
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports ={
  restricted,
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree
}