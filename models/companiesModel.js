const db = require("../db");
const ExpressError = require("../helpers/expressError");
const app = require("../app");


class Company {

  static async getAll(){

    const result = await db.query(
      `SELECT handle, name
       FROM companies`
    )
    return result.rows
  }

  // static async getAllSearch()
}

module.exports = Company;