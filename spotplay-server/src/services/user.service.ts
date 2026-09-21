import bcrypt from "bcrypt";
import { pool } from "../config/db.js";

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
}

export const getById = async (id: string) => {
  const result = await pool.query(
    "SELECT id, username, email, createdat, refreshtoken FROM users WHERE id = $1",
    [id],
  );
  return result.rows[0];
};

export const findByEmail = async (email: string) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  return result.rows[0];
};

export const saveRefreshToken = async (
  userId: string,
  refreshToken: string,
) => {
  await pool.query("UPDATE users SET refreshtoken = $1 WHERE id = $2", [
    refreshToken,
    userId,
  ]);
};

export const create = async (data: CreateUserInput) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);

  const userResult = await pool.query(
    "INSERT INTO users (username, email, passwordhash) VALUES ($1, $2, $3) RETURNING id, username, email, createdat",
    [data.username, data.email, hashedPassword],
  );

  const newUser = userResult.rows[0];

  await pool.query("INSERT INTO useractivity (userid) VALUES ($1)", [
    newUser.id,
  ]);

  return newUser;
};

export const removeRefreshToken = async (userId: string) => {
  await pool.query("UPDATE users SET refreshtoken = NULL WHERE id = $1", [
    userId,
  ]);
};
