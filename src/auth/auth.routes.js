import { Router } from "express";
import { login, registerUser } from "../auth/auth.controller.js";
import { loginValidator, registerValidator } from "../middleware/user-validators.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { hasRoles } from "../middlewares/validate-roles.js"

const router = Router();

router.post("/login", validateJWT, hasRoles("ADMIN_ROLE"), loginValidator, login);

router.post("/registerUser", registerValidator, registerUser);

export default router;