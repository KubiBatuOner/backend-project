const TwitModel = require("./twit-model");

const checkUserId = async function (req, res, next) {
  try {
    const isExist = await TwitModel.idyeGorePostGetir(req.params.id);
    if (isExist.length == 0) {
      res.status(404).json({ message: "id bulunamadı" });
    } else {
      req.yorum = isExist;
      next();
    }
  } catch (error) {
    next(error);
  }
};

const checkPayloadAndUserIdExist = async (req, res, next) => {
  let { user_id, post_content } = req.body;
  if (user_id === undefined || post_content === undefined) {
    next({
      status: 400,
      message: "Eksik alan var",
    });
  } else {
    next();
  }
};

const checkPostId = async (req, res, next) => {
  try {
    const isExist = await TwitModel.postId(req.params.post_id);
    if (!isExist) {
      res.status(404).json({ message: "id bulunamadı" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

const checkPostContent = async (req, res, next) => {
  try {
    let { post_content } = req.body;
    if (!post_content) {
      res.status(404).json({ message: "post kısmını doldurun" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkUserId,
  checkPayloadAndUserIdExist,
  checkPostId,
  checkPostContent,
};
