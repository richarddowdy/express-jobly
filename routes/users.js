const express = require('express');
const ExpressError = require("../helpers/expressError");
const router = new express.Router();
const User = require("../models/usersModel")

// const jsonschema = require("jsonschema");
// const companySchema = require("../schema/companySchema.json");

router.get("/", async function(req, res, next){
  try{
    const result = await User.getAll()
    return res.json({ users: result });

  } catch(err) {
    return next(err);
  }
})

router.get("/:id", async function(req, res, next){
  try{
    const result = await User.get(req.params.id);

    return res.json({ user: result })

  } catch (err){
    return next(err);
  }
})




module.exports = router;