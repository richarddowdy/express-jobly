const db = require("../db");
const sqlForPartialUpdate = require("../helpers/partialUpdate")
const bcrypt = require("bcrypt")
const {BCRYPT_WORK_FACTOR} = require("../config")


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

  static async create(data){

    const { username, password, first_name, last_name, email } = data

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

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
         email,
         is_admin`,
       [username, hashedPassword, first_name, last_name, email, false]
    )
    return result.rows[0]
  }



  static async update(data, username) {
    // delete username from the body so that username cannot be passed into the helper
    // function.  Username is the primary key and cannot be updated.
    delete data.username  

    const { password, first_name, last_name, email, photo_url } = data;
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const values = { password: hashedPassword, first_name, last_name, email, photo_url };
    

    const helperQuery = sqlForPartialUpdate("users", values, "username", username)
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
  
  static async authenticate(username, password){
    let result = await db.query(
      `SELECT password FROM users
       WHERE username = $1`,
       [username]
    )
    let user = result.rows[0]
    return user && await bcrypt.compare(password, user.password);
  }
  
  static async adminStatus(username){
    let result = await db.query(
      `SELECT is_admin FROM users
       WHERE username = $1`,
      [username]
    )
    return result.rows[0].is_admin;
  }
}




module.exports = User;