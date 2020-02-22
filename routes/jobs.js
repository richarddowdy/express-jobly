const express = require('express');
const ExpressError = require("../helpers/expressError");
const Job = require("../models/jobsModel")
const router = new express.Router();
const jsonschema = require("jsonschema");
const jobSchema = require("../schema/jobSchema.json");

const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth")


router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body, jobSchema);
    if (!result.valid) {
      let listOfErrors = result.errors.map(error => error.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }
    const { title, salary, equity, company_handle } = req.body;
    if (!company_handle) {
      throw new ExpressError("Missing company handle", 400);
    }

    const createdJob = await Job.create(title, salary, equity, company_handle);
    return res.status(201).json({ job: createdJob });

  } catch (err) {
    return next(err);
  }
})

router.get("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const searchTitle = req.query.title;
    const minSalary = req.query.min_salary;
    const minEquity = req.query.min_equity;
    const maxSQLInt = 2147483647;

    if (minSalary > maxSQLInt || minSalary < 0 || minEquity > 0.99 || minEquity < 0) {
      throw new ExpressError("Bad request", 400);
    }
    let result = await Job.getQuerySearch(searchTitle, minSalary, minEquity);

    return res.json({ jobs: result })
  } catch (err) {
    return next(err);
  }


})

router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const result = await Job.getJob(req.params.id);
    if (!result) {
      throw new ExpressError("Invalid job id", 404);
    }
    return res.json(result)

  } catch (err) {
    return next(err)
  }
});



router.patch("/:id", ensureAdmin, async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body, jobSchema);
    if (!result.valid) {

      let listOfErrors = result.errors.map(error => error.stack);
      let error = new ExpressError(listOfErrors, 400);

      return next(error);
    }

    const { id, title, salary, equity } = req.body;
    const data = { title, salary, equity };

    const updatedJob = await Job.update(data, id);

    return res.json({ job: updatedJob });

  } catch (err) {
    return next(err)
  }
})

router.delete("/:id", ensureAdmin, async function (req, res, next) {
  try {
    const result = await Job.remove(req.params.id);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
})




module.exports = router;