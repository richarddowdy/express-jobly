const db = require("../db");
const ExpressError = require("../helpers/expressError");
const app = require("../app");


class Company {

  // static async getAll(){

  //   const result = await db.query(
  //     `SELECT handle, name
  //      FROM companies`
  //   )
  //   return result.rows
  // }

  static async getQuerySearch(name = "%", min = 0, max = 2147483647) {
    const wildName = `%${name}%`;
    const result = await db.query(
      `SELECT handle, name 
       FROM companies 
       WHERE name LIKE $1
       AND num_employees >= $2 
       AND num_employees <= $3`,
      [wildName, min, max]
    )
    return result.rows;
  }
  static async create(handle, name, num_employees, description, logo_url) {
    const result = await db.query(
      `INSERT INTO companies(
        handle,
        name,
        num_employees,
        description,
        logo_url
      ) VALUES (
        $1, $2, $3, $4, $5)
        RETURNING *`,
      [handle, name, num_employees, description, logo_url]
    )
    return result.rows[0];
  }

  static async getOne(handle) {
    const result = await db.query(
      `SELECT 
      handle,
        name,
        num_employees,
        description,
        logo_url
        FROM companies
        WHERE handle = $1`
        , [handle]
    ) 
    return result.rows[0];
  }

  static async update(data, handle) {
    const result = await db.query (
      `UPDATE companies SET
        name=($1),
        num_employees=($2),
        description=($3),
        logo_url=($4)
        WHERE handle=$5
        RETURNING
        handle,
        name,
        num_employees,
        description,
        logo_url`,
        [data.name,
        data.num_employees,
        data.description, 
        data.logo_url, 
        handle]
    );
    if (result.rows.length === 0) {
      throw { message: `There is no company with that handle '${handle}`, status: 404}
    } else {
      return result.rows[0];
    }
  }
}



module.exports = Company;