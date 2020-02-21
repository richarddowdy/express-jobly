const express = require('express');
const ExpressError = require("../helpers/expressError");
const router = new express.Router();
const User = require("../models/usersModel")
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");
const jsonschema = require("jsonschema");
const userSchema = require("../schema/userSchema.json");
const { ensureCorrectUser } = require("../middleware/auth")
const { ensureLoggedIn } = require("../middleware/auth")

/** NEED TO ADD BCRYPT SO THAT WE ARE NOT 
 *  STORING PASSWORD IN THE DB AS PLAIN TEXT
 */
router.get("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const result = await User.getAll()
    return res.json({ users: result });

  } catch (err) {
    return next(err);
  }
})

router.get("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const result = await User.get(req.params.username);

    return res.json({ user: result })

  } catch (err) {
    return next(err);
  }
})

router.post("/", async function (req, res, next) {
  try {

/** Need Bcrypt HERE */

    const result = jsonschema.validate(req.body, userSchema);
    if (!result.valid) {
      let listOfErrors = result.errors.map(error => error.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }
    const { username, password, first_name, last_name, email } = req.body

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    let createdUser = await User.create(username, hashedPassword, first_name, last_name, email)
    return res.status(201).json({ user: createdUser });

  } catch (err) {
    return next(err);
  }
})



router.patch("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body, userSchema);
    if (!result.valid) {

      let listOfErrors = result.errors.map(error => error.stack);
      let error = new ExpressError(listOfErrors, 400);

      return next(error);
    }

    const updatedUser = await User.update(req.body, req.body.username);

    return res.json({ user: updatedUser });

  } catch (err) {
    return next(err)
  }
})

router.delete("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const result = await User.remove(req.params.username);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
})



module.exports = router;