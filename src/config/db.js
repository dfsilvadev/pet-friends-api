const mongoose = require("mongoose");

const dbUser = process.env.MONGODB_USER;
const dbPassword = process.env.MONGODB_PASS;

const conn = async () => {
  try {
    const dbConn = await mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPassword}@cluster0.lmkeedy.mongodb.net/?retryWrites=true&w=majority`
    );

    console.log("Conectou ao banco!");

    return dbConn;
  } catch (err) {
    console.error(err);
  }
};

conn();

module.exports = conn;
