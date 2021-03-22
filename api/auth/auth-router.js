const router = require('express').Router()
const { checkIfFieldsValid } = require("./auth-Middleware")
const { add, findByUsername } = require("./auth-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


// My middleare functions were NOT working so I had to do things manually. I know its not dry but at least it works

router.post('/register', async (req, res) => {
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */

  if(!req.body.username || !req.body.password) {
    return res.status(422).json({error: "username and password required"})
  }

  const username = req.body.username
  const password = await bcrypt.hash(req.body.password, 9)

  const userExists = await findByUsername(username)
  console.log(userExists)

  if(userExists.length == 1) {
    return res.status(409).json({error: "username taken"})
  }
      try{ 
        const newUser = await add(username, password)
        res.status(201).json(newUser)
      } catch(err) {
        res.status(416).json({err})
      }

});


router.post('/login', async (req, res) => {
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */

    if(!req.body.username || !req.body.password) {
    return res.status(422).json({error: "username and password required"})
  }
 try {
  const {username, password} = req.body
  const existingUser = await findByUsername(username)
  const passwordValid = await bcrypt.compare(password, existingUser[0].password)
  
  if(!existingUser || !passwordValid) {
    return res.status(402).json({error: "invalid credentials"})
  } else {

    // creates token
    const token = jwt.sign({
      user_id: existingUser.id,
      username: existingUser.username
    }, "secret")

    // responds with delicious chocolate chip cookie
    res.cookie("token", token)
    res.json({"message": `welcome, ${existingUser[0].username}`, "token": `${token}`})
    
  }
 } catch(err) {
   res.json({err})
 }
});

module.exports = router;
