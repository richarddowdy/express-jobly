const db = require("../db");
const sqlForPartialUpdate = require("../helpers/partialUpdate")


class Company {

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

  static async getOne(companyHandle) {
    const result = await db.query(
      `SELECT 
        handle,
        name,
        num_employees,
        description,
        logo_url
        FROM companies
        WHERE handle = $1`
        , [companyHandle]
    ) 
    
    if(result.rows.length === 0){
      return false;
    }

    const { handle, name, num_employees, description, logo_url } = result.rows[0];

    const result2 = await db.query(
      `SELECT 
      id,
      title,
      salary,
      equity,
      company_handle,
      date_posted
      FROM jobs
      WHERE company_handle = $1`,
      [handle]
    )


    return { company: {handle, name, num_employees, description, logo_url, jobs: 
      result2.rows
    }};
  }

  static async update(data, handle) {

    const helperQuery = sqlForPartialUpdate("companies", data, "handle", handle)
    console.log(helperQuery)
    const result = await db.query(helperQuery.query, helperQuery.values)

    if (result.rows.length === 0) {
      throw { message: `There is no company with that handle '${handle}`, status: 404}
    } else {
      return result.rows[0];
    }
  }

  static async remove(handle){
    const result = await db.query(
      `DELETE FROM companies
       WHERE handle = $1
       RETURNING handle`,
       [handle]
    )
    if(!result.rows.length){
      throw { message: `There is no company with that handle '${handle}`, status : 404 }
    }
  }
}



module.exports = Company;