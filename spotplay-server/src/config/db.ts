import { Pool } from "pg";
import dotenv from "dotenv";

//Reading env file
dotenv.config();

console.log(
  "DB URL starts with:",
  process.env.DATABASE_URL
    ? process.env.DATABASE_URL.substring(0, 15)
    : "UNDEFINED!!!",
);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Errror to connection BD:", err.message);
  } else {
    console.log("Good connection to PostgreSQL!");
  }
});
