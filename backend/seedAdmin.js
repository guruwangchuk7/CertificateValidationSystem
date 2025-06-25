const bcrypt = require('bcrypt');
const User = require('./models/User');

async function seed() {
  try {
    const hash = await bcrypt.hash('12345', 10);
    await User.create({
      email: 'admin1234@gmail.com',
      passwordHash: hash,
      role: 'admin',
      name: 'Admin User',
    });
    console.log('Admin user created');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
