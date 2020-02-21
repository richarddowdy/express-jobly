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


  static async get(userId){
    let response = await db.query(
      `SELECT 
       username,
       first_name,
       last_name,
       email
       FROM users, 
       WHERE id = $1`,
       [userId]
    )
    if(!response){
      throw { message: "That user does not exist", status: 404}
    }
    return response.rows[0];
  }
}
module.exports = User;