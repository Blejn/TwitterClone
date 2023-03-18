const { Pool } = require("pg");

const client = new Pool({
  user: "blejn",
  host: "demo-postgres.ckngqqeunoj2.eu-north-1.rds.amazonaws.com",
  database: "sampleDB",
  password: "Seba371216183642",
  port: 5432,
});
module.exports = pool;
