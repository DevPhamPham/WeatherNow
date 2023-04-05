const mongoose = require("mongoose");
require("dotenv").config()

async function connect() {
  try {
    await mongoose.connect(process.env.db);
    console.log('connect successful!');
  } catch (error) {
    console.log(error);
  }
}

module.exports = { connect };
