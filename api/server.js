const express = require("express");
const server = express();

const authRouter = require("./auth/auth-router");
const usersRouter = require("./user/users-router");
const twitRouter = require("./twit/twit-router");

const mw = require("./auth/auth-middleware");

server.use(express.json());

server.use("/api/auth", authRouter);
server.use("/api/users", mw.restricted, usersRouter);
server.use("/api/twit", mw.restricted, twitRouter);

server.use("*", (req, res) => {
  res.status(404).json({ message: "not found" });
});

server.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
