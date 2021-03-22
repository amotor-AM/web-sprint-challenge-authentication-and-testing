const {findByUsername} = require("./auth-model")

function verifyUserDoesNotExist() {
    return async (req, res, next) => {
        const {username} = req.body.username
        const user = await findByUsername(username)

        if(!user) {
        next()
    }

    req.userInfo = user
    return res.status(409).json({error: "username taken"})
    }
}

// const checkFieldsValid = (req, res, next) => {
//     if(!req.username || !req.password) {
//         return res.status(422).json({error: "username and password required"})
//     } else {
//         next()
//     }
// }

function checkFieldsValid() {
    return (req, res, next) => {
      if(!req.body.username || !req.body.password) {
       return res.status(422).json({error: "username and password required"})
    } else {
        next()
    }  
    }
}

module.exports = {
    verifyUserDoesNotExist,
    checkFieldsValid
}