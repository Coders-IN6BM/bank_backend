import { Router } from "express";
import { login, registerUser } from "../auth/auth.controller.js";
import { loginValidator, registerValidator } from "../middleware/user-validators.js";

const router = Router();

// Ruta para login (no requiere autenticación previa)
router.post("/login", loginValidator, login);

// Ruta para registro de usuario (solo ADMIN puede registrar nuevos usuarios)
router.post("/registerUser", registerValidator, registerUser);

export default router;