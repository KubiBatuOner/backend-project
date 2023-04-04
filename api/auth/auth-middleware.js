const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/index");
const bcrypt = require("bcryptjs");
const UserModel = require("../user/user-model");

const restricted = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decodedJWT) => {
      if (err) {
        next({
          status: 401,
          message: "Geçersiz token",
        });
      } else {
        req.userInfo = decodedJWT;
        next();
      }
    });
  } else {
    next({ status: 401, message: "Token yok" });
  }
};

const payloadCheck = async function (req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res
        .status(400)
        .json({ message: "Name,email ve password alanlarını doldurun" });
    } else {
      req.encPassword = await bcrypt.hash(req.body.password, 8);
      next();
    }
  } catch (error) {
    next(error);
  }
};

const nameAndEmailCheck = async function (req, res, next) {
  try {
    const { name, email } = req.body;
    let nameControl = await UserModel.findByFilter({ name: name });
    let emailControl = await UserModel.findByFilter({ email: email });
    if (nameControl) {
      res.status(401).json({
        message:
          "Bu kullanıcı adı daha önce alınmış, lütfen başka bir kullanıcı adı deneyin",
      });
    } else if (emailControl) {
      res.status(401).json({
        message: "Bu email adresi ile önceden oturum açılmış",
      });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

const passwordCheck = async function (req, res, next) {
  try {
    let user = await UserModel.findByFilter({ name: req.body.name });
    if (!user) {
      next({
        status: 401,
        message: "geçersiz kriterler",
      });
    } else {
      const { password } = req.body;
      let correctPassword = bcrypt.compareSync(password, user.password);
      if (!correctPassword) {
        next({
          status: 401,
          message: "geçersiz kriterler",
        });
      } else {
        req.user = user;
        next();
      }
    }
  } catch (error) {
    next(error);
  }
};

const payloadCheckLogin = async function (req, res, next) {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      res.status(400).json({ message: "Name, password alanlarını doldurun" });
    } else {
      req.encPassword = await bcrypt.hash(req.body.password, 8);
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  restricted,
  payloadCheck,
  nameAndEmailCheck,
  passwordCheck,
  payloadCheckLogin,
};
