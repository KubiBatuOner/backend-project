const db = require("../../data/db-config");

async function getAllUsers() {
  let users = await db("users").select("user_id", "name", "email");
  return users;
}

async function findByFilter(filter) {
  return db("users").where(filter).first();
}

async function findById(user_id) {
  return db("users")
    .select("user_id", "name")
    .where("user_id", user_id)
    .first();
}

async function addUser(user) {
  const [user_id] = await db("users").insert(user);
  return await findById(user_id);
}

async function updateUser(user, user_id) {
  await db("users").where("user_id", user_id).update(user);
  return findById(user_id);
}

async function deleteUser(user_id) {
  return db("users").where("user_id", user_id).delete();
}

module.exports = {
  getAllUsers,
  findByFilter,
  findById,
  addUser,
  updateUser,
  deleteUser,
};
