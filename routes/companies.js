const express = require('express');
const ExpressError = require("../helpers/expressError");
const Company = require("../models/companiesModel")
const router = new express.Router();
const jsonschema = require("jsonschema");
const companySchema = require("../schema/companySchema.json");

/** GET /companies should return list of all company handles */

router.get("/", async function (req, res, next) {
  try {
    const searchCom = req.query.search;
    const minEmp = req.query.min_employees;
    const maxEmp = req.query.max_employees;
    const maxSQLInt = 2147483647;

    if (minEmp > maxEmp || minEmp < 0 || maxEmp > maxSQLInt || maxEmp < 0) {
      throw new ExpressError("Bad request", 400);
    } else {
      let result = await Company.getQuerySearch(searchCom, minEmp, maxEmp);

      return res.json({ "companies": result })
    }
  } catch (err) {
    return next(err)
  }


})

router.post("/", async function (req, res, next) {
  try {

    const result = jsonschema.validate(req.body, companySchema);
    if (!result.valid) {
      let listOfErrors = result.errors.map(error => error.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    } else {
      const { handle, name, num_employees, description, logo_url } = req.body;
      const createdCompany = await Company.create(handle, name, num_employees, description, logo_url);
      return res.status(201).json({ company: createdCompany });
    }
  } catch (err) {
    return next(err)
  }
})

router.get("/:handle", async function (req, res, next) {
  try {
    let result = await Company.getOne(req.params.handle);
    if (!result) {
      throw new ExpressError("Invalid company handle", 400);
    } else {
      return res.json({ company: result });
    }
  } catch (err) {
    return next(err)
  }
})

router.patch("/:handle", async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body, companySchema);
    if (!result.valid) {

      let listOfErrors = result.errors.map(error => error.stack);
      let error = new ExpressError(listOfErrors, 400);

      return next(error);
    } else {
      
      const { handle, name, num_employees, description, logo_url } = req.body;
      const data = {name, num_employees, description, logo_url};

      const updatedCompany = await Company.update(data, handle);

      return res.json({ company: updatedCompany });
    }
  } catch (err) {
    return next(err)
  }
})

router.delete("/:handle", async function(req, res, next){
  try {
    await Company.remove(req.params.handle);
    return res.json({ message: "Company Deleted!"})
  } catch (err){
    return next(err);
  }
})

module.exports = router;