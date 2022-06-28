const express = require('express');
const app = express();
const path = require('path');
const { db, User } = require('./db');

app.use('/dist', express.static(path.join(__dirname, '../dist')));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

//example generic loader GET route------------------------
app.get('/api/:slice', async (req, res, next) => {
  try {
    let tableName = req.params.slice;
    //table names in postgres are always lowercase unless in quotes
    const regExp = /[A-Z]/;
    if (regExp.test(tableName)) tableName = `"${tableName}"`;
    const response = await db.query(`SELECT * FROM ${tableName} ;`);
    res.send(response[0]);
  } catch (error) {
    next(error);
  }
});

//example crud routes-----------------------------------
app.post('/api/users', async (req, res, next) => {
  try {
    const data = req.body;
    const response = await User.create(data);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

app.put('/api/users', async (req, res, next) => {
  try {
    //generic put sends a req.body that looks like:
    /*body: {data, identifier} */
    const userToUpdate = await User.findByPk(req.body.identifier.id);
    const data = req.body.data;
    const response = await userToUpdate.update(data);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/users', async (req, res, next) => {
  try {
    const doomedUser = await User.findByPk(req.body.id);
    await doomedUser.destroy();
    res.send(doomedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = app;
