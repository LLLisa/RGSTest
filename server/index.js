const app = require('./api');
const { db, seed } = require('./db');

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
