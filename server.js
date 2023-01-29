const express = require("express");
const jsonServer = require("json-server");

const app = express();
const router = jsonServer.router("db.json");
app.use(jsonServer.defaults());
app.use(router);

app.listen(3001, () => {
  console.log("JSON Server is running");
});
