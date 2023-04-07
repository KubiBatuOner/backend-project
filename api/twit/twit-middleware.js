const TwitModel = require("./twit-model");

const checkUserId = async function (req, res, next) {
  try {
    const isExist = await TwitModel.idyeGorePostGetir(req.params.id);
    if (isExist.length == 0) {
      res.status(404).json({ message: "user id bulunamadı" });
    } else {
      req.yorum = isExist;
      next();
    }
  } catch (error) {
    next(error);
  }
};

const checkPayloadAndCommentIdExist = async (req, res, next) => {
  let { post_id, post_comment } = req.body;
  let { user_id } = req.userInfo;
  if (
    user_id === undefined ||
    post_id == undefined ||
    post_comment === undefined
  ) {
    next({
      status: 400,
      message: "Eksik alan var",
    });
  } else {
    next();
  }
};

const checkPayloadAndUserIdExist = async (req, res, next) => {
  let { post_content } = req.body;
  let { user_id } = req.userInfo;
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
      res.status(404).json({ message: "post id bulunamadı" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

const checkCommentId = async (req, res, next) => {
  try {
    const isExist = await TwitModel.commentId(req.params.comment_id);
    if (!isExist) {
      res.status(404).json({ message: "comment id bulunamadı" });
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

const checkCommentContent = async (req, res, next) => {
  try {
    let { post_comment } = req.body;
    if (!post_comment) {
      res.status(404).json({ message: "comment kısmını doldurun" });
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
  checkPayloadAndCommentIdExist,
  checkCommentId,
  checkCommentContent,
};
