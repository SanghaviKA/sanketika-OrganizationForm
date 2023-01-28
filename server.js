// const low = require('lowdb');
// const FileSync = require('lowdb/adapters/FileSync');
// const adapter = new FileSync('db.json');
// const db = low(adapter);

const express = require('express');
const jsonServer = require('json-server');

const app = express();
const router = jsonServer.router('db.json');
app.use(jsonServer.defaults());
app.use(router);

app.listen(3001, () => {
console.log('JSON Server is running');
  });
  

