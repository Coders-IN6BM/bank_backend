import { body, param } from "express-validator";
import { emailExist, usernameExist, userExists, isAdmin } from "../helpers/db-validators.js";
import { validarCampos } from "./validate-fields.js";
import { deleteFileOnError } from "./delete-file-on-error.js"
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";
import { handleErrors } from "./handle-error.js";

export const registerValidator = [
    body("name").notEmpty().withMessage("El nombre es requerido"),
    body("username").notEmpty().withMessage("El username es requerido"),
    body("email").notEmpty().withMessage("El correo es requerido"),
    body("email").isEmail().withMessage("No es un correo válido"),
    body("email").custom(emailExist),
    body("dpi").notEmpty().withMessage("El DPI es requerido"),
    body("dpi").isLength({ min: 13, max: 13 }).withMessage("El DPI debe tener 13 caracteres"),
    body("dpi").custom(userExists),
    body("ingresosMensuales").isNumeric().withMessage("Los ingresos mensuales deben ser un número"),
    body("ingresosMensuales").isFloat({ min: 100 }).withMessage("Los ingresos deben ser mayores a Q100"),
    validarCampos,
    deleteFileOnError,
    handleErrors
];

export const editUserValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("id").notEmpty().withMessage("El ID es requerido"),
    param("id").isMongoId().withMessage("El ID debe ser válido"),
    param("id").custom(isAdmin).withMessage("No puedes editar a otro administrador"),
    body("name").optional().isString().withMessage("El nombre debe ser un texto"),
    body("address").optional().isString().withMessage("La dirección debe ser un texto"),
    body("nombreTrabajo").optional().isString().withMessage("El nombre del trabajo debe ser un texto"),
    body("ingresosMensuales").optional().isNumeric().withMessage("Los ingresos mensuales deben ser un número"),
    body("phone").optional().isString().withMessage("El celular debe ser un texto"),
    body("email").optional().isEmail().withMessage("El correo debe ser válido"),
    validarCampos
];

export const deleteUserValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("id").notEmpty().withMessage("El ID es requerido"),
    param("id").isMongoId().withMessage("El ID debe ser válido"),
    param("id").custom(isAdmin).withMessage("No puedes eliminar a otro administrador"),
    validarCampos
];

export const getUserValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("id").notEmpty().withMessage("El ID es requerido"),
    param("id").isMongoId().withMessage("El ID debe ser válido"),
    param("id").custom(isAdmin).withMessage("No puedes visualizar a otro administrador"),
    validarCampos
];

export const listarUsersValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    validarCampos
];

export const loginValidator = [
    body("email").optional().isEmail().withMessage("No es un email válido"),
    body("username").optional().isString().withMessage("Username es en formáto erróneo"),
    body("password").isLength({ min: 4 }).withMessage("El password debe contener al menos 8 caracteres"),
    validarCampos,
    handleErrors
];