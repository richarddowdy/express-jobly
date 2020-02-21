const express = require('express');
const ExpressError = require("../helpers/expressError");
const router = new express.Router();
const User = require("../models/usersModel")

const jsonschema = require("jsonschema");
const userSchema = require("../schema/userSchema.json");

router.get("/", async function (req, res, next) {
  try {
    const result = await User.getAll()
    return res.json({ users: result });

  } catch (err) {
    return next(err);
  }
})

router.get("/:id", async function (req, res, next) {
  try {
    const result = await User.get(req.params.id);

    return res.json({ user: result })

  } catch (err) {
    return next(err);
  }
})

router.post("/", async function (req, res, next) {
  try {
    console.log(req.body);
    const result = jsonschema.validate(req.body, userSchema);
    if (!result.valid) {
      let listOfErrors = result.errors.map(error => error.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }
    const { username, password, first_name, last_name, email, is_admin } = req.body

    let createdUser = await User.create(username, password, first_name, last_name, email, is_admin)

    return res.status(201).json({ user: createdUser });

  } catch (err) {
    return next(err);
  }
})



router.patch("/:username", async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body, userSchema);
    if (!result.valid) {

      let listOfErrors = result.errors.map(error => error.stack);
      let error = new ExpressError(listOfErrors, 400);

      return next(error);
    }

    const username = req.params.username;
    const { password, first_name, last_name, email, photo_url, is_admin } = req.body

    const data = { password, first_name, last_name, email, photo_url, is_admin };

    const updatedUser = await User.update(data, username);

    return res.json({ user: updatedUser });

  } catch (err) {
    return next(err)
  }
})

router.delete("/:username", async function (req, res, next) {
  try {
    const result = await User.remove(req.params.username);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
})



module.exports = router;