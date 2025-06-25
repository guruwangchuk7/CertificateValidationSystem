const sequelize = require('./index');
const User = require('./User');
const Certificate = require('./Certificate');

async function sync() {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    await sequelize.sync({ force: true });  // WARNING: force: true resets DB on each run
    console.log('Models synced');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

sync();
