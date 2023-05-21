const express = require("express");
const http = require("http");
const app = express();
const server = http.Server(app);
const socketIO = require("socket.io");
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }});
  module.exports = {app,io,express,server}