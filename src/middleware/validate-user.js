import { body, param } from "express-validator";
import { correoExists, userExists } from "../helpers/db-validator.js";
import { validateFields } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { generateJWT } from "../helpers/jwt-validator.js";
import { hasRoles } from "./validate-roles.js";


export const registerValidator = [
    body("nombre").notEmpty().withMessage("El nombre es requerido"),
    body("username").notEmpty().withMessage("El username es requerido"),
    body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
    body("rol").notEmpty().isIn(['admin', 'cliente']).withMessage("Rol inválido"),
    body("DPI").notEmpty().isLength({ min: 13, max: 13 }).withMessage("DPI debe tener 13 dígitos").matches(/^[0-9]+$/).withMessage("DPI solo debe contener números"),
    body("direccion").notEmpty().withMessage("La dirección es requerida"),
    body("celular").notEmpty().isLength({ min: 8, max: 8 }).withMessage("El celular debe tener 8 dígitos").matches(/^[0-9]+$/).withMessage("El celular solo debe contener números"),
    body("correo").notEmpty().withMessage("El email es requerido"),
    body("correo").isEmail().withMessage("No es un email válido"),
    body("correo").custom(correoExists),
    body("nombreTrabajo").notEmpty().withMessage("El nombre del trabajo es requerido"),
    body("ingresosMensuales").isNumeric().withMessage("Ingresos mensuales debe ser un número").custom((value) => value > 100).withMessage("Ingresos deben ser mayores a Q100"),
    validateFields,
    handleErrors
];


export const crearUsuarioValidator = [
    generateJWT,
    hasRoles("admin"),
    body("nombre").notEmpty().withMessage("El nombre es requerido"),
    body("username").notEmpty().withMessage("El username es requerido"),
    body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
    body("rol").notEmpty().isIn(['admin', 'cliente']).withMessage("Rol inválido"),
    body("DPI").notEmpty().isLength({ min: 13, max: 13 }).withMessage("DPI debe tener 13 dígitos").matches(/^[0-9]+$/).withMessage("DPI solo debe contener números"),
    body("direccion").notEmpty().withMessage("La dirección es requerida"),
    body("celular").notEmpty().isLength({ min: 8, max: 8 }).withMessage("El celular debe tener 8 dígitos").matches(/^[0-9]+$/).withMessage("El celular solo debe contener números"),
    body("correo").notEmpty().withMessage("El email es requerido"),
    body("correo").isEmail().withMessage("No es un email válido"),
    body("correo").custom(correoExists),
    body("nombreTrabajo").notEmpty().withMessage("El nombre del trabajo es requerido"),
    body("ingresosMensuales").isNumeric().withMessage("Ingresos mensuales debe ser un número").custom((value) => value > 100).withMessage("Ingresos deben ser mayores a Q100"),
    validateFields,
    handleErrors
];


export const loginValidator = [
    body("correo").isEmail().withMessage("Correo en formato invalido"),
    body("password").notEmpty().withMessage("La contraseña es requerida"),
    validateFields,
    handleErrors
];


export const actualizarUsuarioValidator = [
    generateJWT,
    hasRoles("cliente", "admin"),

    body("nombre").optional().isString().withMessage("Nombre inválido"),
    body("direccion").optional().isString().withMessage("Dirección inválida"),
    body("nombreTrabajo").optional().isString().withMessage("Nombre de trabajo inválido"),
    body("ingresosMensuales").optional().isNumeric().withMessage("Ingresos mensuales debe ser un número").custom((value) => value > 100).withMessage("Ingresos deben ser mayores a Q100"),
    body("celular").optional().isLength({ min: 8, max: 8 }).withMessage("El celular debe tener 8 dígitos").matches(/^[0-9]+$/).withMessage("El celular solo debe contener números"),
    body("correo").optional().isEmail().withMessage("No es un email válido"),
    validateFields,
    handleErrors
];


export const actualizarAdminValidator = [
    generateJWT,
    hasRoles("admin"),
    validateFields,
    handleErrors
];


export const eliminarUsuarioModoAdminValidator = [
    generateJWT,
    hasRoles("admin"),
    param("id").isMongoId().withMessage("No es un ID válido de MongoDB"),
    validateFields,
    handleErrors
];


export const eliminarUsuarioValidator = [
    generateJWT,
    hasRoles("admin"),
    validateFields,
    handleErrors
];
