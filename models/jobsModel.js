const db = require("../db");
const ExpressError = require("../helpers/expressError");
const app = require("../app");
const sqlForPartialUpdate = require("../helpers/partialUpdate")


class Job {
  static async create(title, salary, equity, company_handle) {
    const result = await db.query(
      `INSERT INTO jobs(
        title,
        salary,
        equity,
        company_handle,
        date_posted
      ) VALUES (
        $1, $2, $3, $4, current_timestamp)
        RETURNING *`,
      [title, salary, equity, company_handle]
    )
    return result.rows[0];
  }

  static async getQuerySearch(title = "%", minSalary = 0, minEquity = 0) {
    const wildtitle = `%${title}%`;
    const result = await db.query(
      `SELECT j.title, j.company_handle 
       FROM jobs as j
       Join companies as c 
       ON j.company_handle = c.handle
       WHERE j.title LIKE $1
       AND j.salary >= $2
       AND j.equity >= $3`,
      [wildtitle, minSalary, minEquity]
    )
    return result.rows;
  }

  static async getJob(id) {
    const result = await db.query(
      `SELECT 
      title,
      salary,
      equity,
      company_handle,
      date_posted
      FROM jobs
      WHERE id = $1`,
      [id]
    )
    return result.rows[0];
  }

  static async update(data, jobId) {

    const helperQuery = sqlForPartialUpdate("jobs", data, "id", jobId)
    const result = await db.query(helperQuery.query, helperQuery.values)

    if (result.rows.length === 0) {
      throw { message: `There is no job with that id '${jobId}`, status: 404}
    } else {
      return result.rows[0];
    }
  }

  static async remove(jobId){
    const result = await db.query(
      `DELETE FROM jobs
       WHERE id = $1
       RETURNING id`,
       [jobId]
    )
    if(!result.rows.length){
      throw { message: `There is no job with that id '${jobId}`, status : 404 }
    }
  }





}

module.exports = Job;