// createdb acme_db

const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost/acme_db', { logging: false });

const User = db.define('user', {
  firstName: {
    type: Sequelize.STRING,
  },
  lastName: {
    type: Sequelize.STRING,
  },
});

const Account = db.define('account', {
  number: { type: Sequelize.INTEGER },
});

const File = db.define('file', {
  title: {
    type: Sequelize.STRING,
  },
});

Account.belongsTo(User);
Account.hasMany(File);

const seed = async () => {
  try {
    const Homer = await User.create({
      firstName: 'Homer',
      lastName: 'Simpson',
    });
    const Marge = await User.create({
      firstName: 'Marge',
      lastName: 'Simpson',
    });
    const Acct1 = await Account.create({ number: 12345, userId: Homer.id });
    const Acct2 = await Account.create({ number: 42069, userId: Marge.id });
    File.create({ title: "Homer's big plans", accountId: Acct1.id });
    File.create({ title: "Homer's small plans", accountId: Acct1.id });
    File.create({ title: "Marge's big plans", accountId: Acct2.id });
    File.create({ title: "Marge's small plans", accountId: Acct2.id });
  } catch (error) {
    console.log(error);
  }
};

const express = require('express');
const app = express();

const path = require('path');

const init = async () => {
  try {
    await db.sync({ force: true });
    seed();
    console.log('~~~db connected~~~');
    app.listen(9001, () => console.log(`listening on port hadrcoded 9001`));
  } catch (error) {
    console.log(error);
  }
};

init();

//api-----------------------------------------------------

// app.use('/index.js', express.static(path.join(__dirname, './index.js')));
app.use('/dist', express.static(path.join(__dirname, './dist')));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
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
