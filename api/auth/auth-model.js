const db = require("../../data/dbConfig")

function findByUsername(input) {
    return db("users").where("username", input)
}

function findById(userId) {
    return db("users").where("id", userId)
}

async function add(u, p) {
    const [id] = await db("users").insert({username: u, password: p})
    return findById(id)
}

module.exports = {findByUsername, add}