import { Router } from "express";
import {
  addUser,
  getUser,
  editUser,
  deleteUser,
  listarUsers
} from "../user/user.controller.js";
import {
  addUserValidator,
  getUserValidator,
  editUserValidator,
  deleteUserValidator,
  listarUsersValidator
} from "../middleware/user-validators.js";

const router = Router();

// Ruta para agregar un usuario
router.post("/addUser", addUserValidator, addUser);

// Ruta para obtener un usuario por ID
router.get("/getUser/:id", getUserValidator, getUser);

// Ruta para editar un usuario por ID
router.put("/editUser/:id", editUserValidator, editUser);

// Ruta para eliminar un usuario por ID
router.delete("/deleteUser/:id", deleteUserValidator, deleteUser);

// Ruta para listar todos los usuarios
router.get("/listarUsers", listarUsersValidator, listarUsers);

export default router;