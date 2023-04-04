const db = require("../../data/db-config");

const postlariGetir = async function () {
  const posts = await db("users as u")
    .leftJoin("posts as p", "u.user_id", "p.user_id")
    .select("u.user_id", "u.name", "p.post_content", "p.posts_date")
    .orderBy("p.posts_date", "DESC");
  return posts;
};

const yorumlariGetir = async function (post_id) {
  const yorumlar = await db("comments as c")
    .leftJoin("posts as p", "c.post_id", "p.post_id")
    .select("c.comment_id", "c.post_comment", "c.comment_date", "p.post_id")
    .where("p.post_id", post_id);
  return yorumlar;
};

const postId = async function (post_id) {
  const post = await db("posts as p").where("p.post_id", post_id).first();
  return post;
};

const idyeGorePostGetir = async function (user_id) {
  const postYorum = await db("users as u")
    .leftJoin("posts as p", "u.user_id", "p.user_id")
    .leftJoin("comments as c", "p.post_id", "c.post_id")
    .select(
      "u.user_id",
      "u.name",
      "p.post_id",
      "p.post_content",
      "p.posts_date",
      "c.comment_id",
      "c.post_comment",
      "c.comment_date"
    )
    .where("u.user_id", user_id)
    .groupBy("p.post_content");
  if (postYorum.length === 0) {
    return [];
  }

  const userModel = {
    user_id: user_id,
    name: postYorum[0].name,
    Postlar: [],
  };
  for (let i = 0; i < postYorum.length; i++) {
    const user = postYorum[i];
    const postModel = {
      post_id: user.post_id,
      post_content: user.post_content,
      posts_date: user.posts_date,
      Yorumlar: [],
    };
    const yorumlar = await yorumlariGetir(user.post_id);
    postModel.Yorumlar = yorumlar;
    userModel.Postlar.push(postModel);
  }
  return userModel;
};

const insertPost = async function (post) {
  const [insertedPostId] = await db("posts").insert(post);
  const newPost = await db("posts").where("post_id", insertedPostId).first();
  return newPost;
};

const updatePost = async function (post, post_id) {
  await db("posts").where("post_id", post_id).update(post);
  return postId(post_id);
};

const deletePost = async function (post_id) {
  return db("posts").where("post_id", post_id).delete();
};

module.exports = {
  postlariGetir,
  yorumlariGetir,
  postId,
  idyeGorePostGetir,
  insertPost,
  updatePost,
  deletePost,
};
