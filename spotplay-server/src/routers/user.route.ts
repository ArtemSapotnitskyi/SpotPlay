import { Router } from "express";
import { register } from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.js";
import { registerSchema } from "../validators/userValidator.js";

const router = Router();

router.post("/register", validate(registerSchema), register);

export default router;
