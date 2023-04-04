const router = require("express").Router();
const UserModel = require("./user-model");
const mw = require("./user-middleware");

router.get("/", async (req, res, next) => {
  const users = await UserModel.getAllUsers();
  res.status(200).json(users);
});

router.delete("/:id", mw.checkUserId, async (req, res, next) => {
  try {
    await UserModel.deleteUser(req.params.id);
    res
      .status(200)
      .json({ message: `${req.params.id} id'li kullanıcı silindi` });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", mw.checkUserId, mw.checkName, async (req, res, next) => {
  try {
    const userUpdate = await UserModel.updateUser(req.body, req.params.id);
    res.status(200).json(userUpdate);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
