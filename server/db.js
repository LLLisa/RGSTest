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

module.exports = { db, seed, User, File, Account };
