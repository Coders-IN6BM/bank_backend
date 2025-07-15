import { body, param, query } from "express-validator";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";
import { accountExists, accountIdExists, userIdExists } from "../helpers/db-validators.js";
import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle-error.js";

export const addAccountValidator = [
    validateJWT,
    hasRoles('ADMIN_ROLE'),
    body('userId', 'El ID del usuario es obligatorio').notEmpty().isMongoId().withMessage('ID de usuario inválido'),
    body('typeAccount', 'El tipo de cuenta es obligatorio').notEmpty().isIn(['AHORRO', 'MONETARIA', 'CREDITO'])
        .withMessage('Tipo de cuenta inválido'),
    body('status').optional().isBoolean().withMessage('El estado debe ser booleano'),
    validarCampos,
    handleErrors
];

export const getAccountByNumberValidator = [
    validateJWT,
    hasRoles('ADMIN_ROLE'),
    param("numAccount").notEmpty().withMessage('El número de cuenta es requerido').isLength({ min: 12, max: 12 }).withMessage('El número debe tener 12 dígitos'),
    param("numAccount").custom(accountExists),
    validarCampos,
    handleErrors
];

export const getMyAccountsValidator = [
    validateJWT,
    validarCampos,
    handleErrors
];

export const getAllAccountsValidator = [
    validateJWT,
    hasRoles('ADMIN_ROLE'),
    validarCampos,
    handleErrors
];

export const selectAccountValidator = [
    query("numAccount").notEmpty().withMessage('El número de cuenta es requerido').isLength({ min: 12, max: 12 }).withMessage('El número debe tener 12 dígitos'),
    validarCampos,
    handleErrors
];

export const getAccountByIdValidator = [
    validateJWT,
    hasRoles('ADMIN_ROLE'),
    param("uid").isMongoId().withMessage('ID de cuenta inválido').custom(accountIdExists),
    validarCampos,
    handleErrors
];
