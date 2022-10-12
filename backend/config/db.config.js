const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  HOST: process.env.AWS_DB_HOST || "localhost",
  USER: process.env.AWS_DB_USER || "root",
  PASSWORD: process.env.AWS_DB_PASSWORD || "123456",
  DB: "eternal_code",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};