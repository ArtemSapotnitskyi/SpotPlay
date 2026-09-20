import { Router } from "express";
import { login, register } from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema, registerSchema } from "../validators/userValidator.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;
