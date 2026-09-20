import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  console.log("Verifying Data in the Database");

  try {
    const migrationsPath = path.join(__dirname, "migrations");

    const files = fs.readdirSync(migrationsPath).sort();

    for (const file of files) {
      if (file.endsWith(".sql")) {
        const filePath = path.join(migrationsPath, file);
        const sql = fs.readFileSync(filePath, "utf-8");

        console.log(`Runing file: ${file}`);
        await pool.query(sql);
      }
    }

    console.log(
      "All migrations have been successfully completed! The database is up to date.",
    );
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    pool.end();
  }
}

runMigrations();
