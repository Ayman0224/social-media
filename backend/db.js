require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});
pool.query("SELECT NOW()")
    .then(result => console.log("Database connected:", result.rows[0]))
    .catch(err => console.error("Database connection error:", err));
module.exports = pool;