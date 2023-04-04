const knex = require("knex");
const knexConfig = require("../knexfile");
const { NODE_ENV } = require("../config/index");

module.exports = knex(knexConfig[NODE_ENV]);
