const db = require("../db");
const sqlForPartialUpdate = require("../helpers/partialUpdate")


class User {

  static async getAll(){
    let response = await db.query(
      `SELECT 
       username,
       first_name,
       last_name,
       email
       FROM users`
    )
    return response.rows
  }


  static async get(username){
    let response = await db.query(
      `SELECT 
       username,
       first_name,
       last_name,
       email
       FROM users
       WHERE username = $1`,
       [username]
    )
    if(!response){
      throw { message: "That user does not exist", status: 404}
    }
    return response.rows[0];
  }

  static async create(username, password, first_name, last_name, email, is_admin){
    let result = await db.query(
      `INSERT INTO users
        (username,
        password,
        first_name,
        last_name,
        email,
        is_admin)
       VALUES
       ($1, $2, $3, $4, $5, $6)
        RETURNING 
        username,
         first_name,
         last_name,
         email`,
       [username, password, first_name, last_name, email, is_admin]
    )
    return result.rows[0]
  }



  static async update(data, username) {

    const helperQuery = sqlForPartialUpdate("users", data, "username", username)
    console.log(helperQuery)
    const result = await db.query(helperQuery.query, helperQuery.values)

    if (result.rows.length === 0) {
      throw { message: `There is no user with that username '${username}`, status: 404}
    } else {
      return result.rows[0];
    }
  }

  static async remove(username){
    const result = await db.query(
      `DELETE FROM users
       WHERE username = $1
       RETURNING username`,
       [username]
    )
    if(!result.rows.length){
      throw { message: `There is no user with that username '${username}`, status : 404 }
    }
    return {message: `User ${username} deleted`}
  }
}
module.exports = User;