import { Pool } from "pg";
import dotenv from "dotenv";

//Reading env file
dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Errror to connection BD:", err.message);
  } else {
    console.log("Good connection to PostgreSQL!");
  }
});
