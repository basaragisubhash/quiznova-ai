require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const users = await User.find({}, 'email name');
    console.log("Users in DB:");
    users.forEach(u => console.log(u.email));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
