const router = require("express").Router();
const UserModel = require("../user/user-model");
const { JWT_SECRET } = require("../../config/index");
const jwt = require("jsonwebtoken");
const mw = require("./auth-middleware");
const bcrypt = require("bcryptjs");

router.get("/", (req, res, next) => {
  res.status(200).json({ message: "auth is working" });
});

router.post(
  "/register",
  mw.payloadCheck,
  mw.nameAndEmailCheck,
  async (req, res, next) => {
    try {
      const newUserObj = {
        name: req.body.name,
        email: req.body.email,
        password: req.encPassword,
      };
      let insertedUser = await UserModel.addUser(newUserObj);
      res.status(201).json(insertedUser);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/login",
  mw.payloadCheckLogin,
  mw.passwordCheck,
  async (req, res, next) => {
    try {
      const token = jwt.sign(
        {
          name: req.user.name,
        },
        JWT_SECRET,
        { expiresIn: "1d" }
      );
      res.status(200).json({
        message: `Merhabalar ${req.user.name}`,
        token: token,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
