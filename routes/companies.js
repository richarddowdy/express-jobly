const express = require('express');
const ExpressError = require("../helpers/expressError");
const Company = require("../models/companiesModel")
const router = new express.Router();

/** GET /companies should return list of all company handles */

router.get("/", async function(req, res, next){
  let searchCompany = req.params.search;
  let minEmployees = req.params.min_employees;
  let maxEmployees = req.params.max_employees;

  if(!searchCompany && !minEmployees && !maxEmployees){
    let result = await Company.getAll();

    return res.json({ "companies": result })
  }
})

module.exports = router;