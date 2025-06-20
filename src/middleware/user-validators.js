import { body, param } from "express-validator";
import { emailExist, userExists } from "../helpers/db-validators.js";
import { validarCampos } from "./validate-fields.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";
import { handleErrors } from "./handle-error.js";

export const registerValidator = [
    body("name").notEmpty().isLength({ max: 25 }),
    body("surname").notEmpty(),
    body("username").notEmpty().isString(),
    body("email").notEmpty().isEmail().custom(emailExist),
    body("password").notEmpty().isLength({ min: 8 }),
    body("dpi").notEmpty().isLength({ min: 13, max: 13 }).custom(userExists),
    body("address").notEmpty(),
    body("phone").notEmpty(),
    body("nombreTrabajo").notEmpty(),
    body("ingresosMensuales").optional().isNumeric().isFloat({ min: 100 }),
    validarCampos,
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
    body("email").optional().isEmail(),
    body("username").optional().isString(),
    body("password").notEmpty().isLength({ min: 8 }),
    validarCampos,
    handleErrors
];