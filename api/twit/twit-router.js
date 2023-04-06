const router = require("express").Router();
const TwitModel = require("./twit-model");
const mw = require("./twit-middleware");

router.get("/", async (req, res, next) => {
  const posts = await TwitModel.postlariGetir();
  res.status(200).json(posts);
});

router.get("/:id", mw.checkUserId, (req, res, next) => {
  res.status(200).json(req.yorum);
});

router.post("/", mw.checkPayloadAndUserIdExist, async (req, res, next) => {
  try {
    let insertedData = await TwitModel.insertPost(req.body);
    res.json(insertedData);
  } catch (error) {
    next(error);
  }
});

router.put(
  "/:post_id",
  mw.checkPostId,
  mw.checkPostContent,
  async (req, res, next) => {
    try {
      const postUpdate = await TwitModel.updatePost(
        req.body,
        req.params.post_id
      );
      res.status(200).json(postUpdate);
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:post_id", mw.checkPostId, async (req, res, next) => {
  try {
    await TwitModel.deletePost(req.params.post_id);
    res
      .status(200)
      .json({ message: `${req.params.post_id} id'li post silindi` });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/comment",
  mw.checkPayloadAndCommentIdExist,
  async (req, res, next) => {
    try {
      let commentData = await TwitModel.insertComment(req.body);
      res.json(commentData);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/comment/:comment_id",
  mw.checkCommentId,
  mw.checkCommentContent,
  async (req, res, next) => {
    try {
      const commentUpdate = await TwitModel.updateComment(
        req.body,
        req.params.comment_id
      );
      res.status(200).json(commentUpdate);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/comment/:comment_id",
  mw.checkCommentId,
  async (req, res, next) => {
    try {
      await TwitModel.deleteComment(req.params.comment_id);
      res
        .status(200)
        .json({ message: `${req.params.comment_id} id'li comment silindi` });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
