import { Router } from "express";
import { login, registerUser } from "../auth/auth.controller.js";
import { loginValidator, registerValidator } from "../middleware/user-validators.js";

const router = Router();

router.post("/login", loginValidator, login);

router.post("/registerUser", upload.single("profilePicture"), registerValidator, registerUser);

export default router;