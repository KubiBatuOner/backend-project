/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", (tbl) => {
      tbl.increments("user_id");
      tbl.string("name", 128).notNullable().unique();
      tbl.string("email", 128).notNullable().unique();
      tbl.string("password", 128).notNullable();
    })
    .createTable("posts", (tbl) => {
      tbl.increments("post_id");
      tbl.string("post_content").notNullable();
      tbl.timestamp("posts_date").defaultTo(knex.fn.now());
      tbl
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("comments", (tbl) => {
      tbl.increments("comment_id");
      tbl.string("post_comment").notNullable();
      tbl.timestamp("comment_date").defaultTo(knex.fn.now());
      tbl
        .integer("post_id")
        .unsigned()
        .notNullable()
        .references("post_id")
        .inTable("posts")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("users_comments", (tbl) => {
      tbl.increments("users_comments_id");
      tbl
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      tbl
        .integer("comment_id")
        .unsigned()
        .notNullable()
        .references("comment_id")
        .inTable("comments")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("users_comments")
    .dropTableIfExists("comments")
    .dropTableIfExists("posts")
    .dropTableIfExists("users");
};
