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

// app.use('/index.js', express.static(path.join(__dirname, './index.js')));
app.use('/dist', express.static(path.join(__dirname, './dist')));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/generic/:slice', async (req, res, next) => {
  try {
    let searchParam = req.params.slice;
    const regExp = /[A-Z]/;
    if (regExp.test(searchParam)) searchParam = `"${searchParam}"`;
    const response = await db.query(`SELECT * FROM ${searchParam};`);
    if (response) {
      res.send(response[0]);
    } else {
      res.send([]);
    }
  } catch (error) {
    next(error);
  }
});

//$ curl -X POST --data '{"data":{"testdata": "success"}}' -H "Content-Type:application/json" localhost:9001/generic/users

app.post('/generic/:slice', async (req, res, next) => {
  try {
    console.log(req.params.slice, req.body.data);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});
