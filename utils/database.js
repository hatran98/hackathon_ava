const mysql2 = require("mysql2");
let pool = mysql2
  .createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "hackathon_av",
  })
  .promise();

module.exports = pool;
