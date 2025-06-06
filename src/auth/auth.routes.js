import { Router } from "express";
import { login } from "../auth/auth.controller.js";
import { loginValidator } from "../middleware/user-validators.js";

const router = Router();

router.post("/login", loginValidator, login);

export default router;