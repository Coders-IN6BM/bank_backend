import { Router } from "express";
import { crearUser, verUser, editarUser, eliminarUser, listarUsers } from "../user/user.controller.js";
import {registerValidator,crearUsuarioValidator,actualizarUsuarioValidator,eliminarUsuarioModoAdminValidator,actualizarAdminValidator} from "../middleware/validate-user.js";
import { auth, permitirRoles } from "../middleware/auth.js";

const router = Router();


router.post("/agregarUser", auth, permitirRoles('admin'), crearUsuarioValidator, crearUser);


router.get("/listarUsers", auth, actualizarAdminValidator, listarUsers);


router.get("/verUser/:id", auth, actualizarUsuarioValidator, verUser);


router.put("/editarUser/:id", auth, actualizarUsuarioValidator, editarUser);


router.delete("/eliminarUser/:id", auth, permitirRoles('admin'), eliminarUsuarioModoAdminValidator, eliminarUser);

export default router;