/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").truncate();
  await knex("posts").truncate();
  await knex("comments").truncate();
  await knex("users").insert([
    {
      name: "Kubilay Batuhan Öner",
      email: "kbatuhanoner@yahoo.com",
      password: "$2a$08$Tp6PI249tFKw9OI6iPf8cu0UxbsIhrCyxXw/qgJIHLY.m/aduKXp2", //123456
    },
    {
      name: "İrem Çelebi",
      email: "irem@irem.com",
      password: "$2a$08$vQGLC9W5QHjTQ1at86ePOeqauJnBQnxlT/rcNHjTpX3r1S1IdUAD6", //45678
    },
    {
      name: "Mert Gök",
      email: "mert@mert.com",
      password: "$2a$08$m5ossVBJiFenw5z/aFwp5eKVDNFvJGs9Y6eZJwJafXbxcvAbuZSvi", //qwerty
    },
  ]);
  await knex("posts").insert([
    { post_content: "Merhabalar", user_id: 1 },
    { post_content: "Bugün pizza yiyeceğim", user_id: 1 },
    { post_content: "Bugün dışarı çıkmak için güzel bir gün", user_id: 2 },
    { post_content: "Bu hafta çok zor bir sınavım var", user_id: 3 },
  ]);
  await knex("comments").insert([
    { post_comment: "Selam", post_id: 1, user_id: 2 },
    { post_comment: "Hoşgeldin", post_id: 1, user_id: 3 },
    { post_comment: "Afiyet olsun", post_id: 2, user_id: 2 },
    {
      post_comment: "Evet hadi bir şeyler yapalım",
      post_id: 3,
      user_id: 3,
    },
    { post_comment: "Ben de geliyorum", post_id: 3, user_id: 1 },
    {
      post_comment: "Yaparsın ben sana güveniyorum",
      post_id: 4,
      user_id: 2,
    },
  ]);
};
