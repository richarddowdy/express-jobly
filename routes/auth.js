const jwt = require("jsonwebtoken");
const Router = require("express").Router;
const router = new Router();

const User = require("../models/usersModel");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../helpers/expressError");

let TOKEN;

router.post("/login", async function (req, res, next) {
  try {

    const { username, password } = req.body;

    if (await User.authenticate(username, password)) {
      const is_admin = await User.adminStatus(username);
      let TOKEN = jwt.sign({ username, is_admin }, SECRET_KEY);
      return res.json({ _token: TOKEN })
    } else {
      throw new ExpressError("Invalid username/password", 400);
    }
  } catch (err) {
    return next(err);
  }
});








module.exports = router;
exports.variableName = TOKEN;