import { body, param } from "express-validator";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";
import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle-error.js";

// ===== VALIDACIONES PARA CLIENTES =====
export const transferFundsValidator = [
    validateJWT,
    hasRoles("CLIENTE_ROL"), // Solo clientes pueden transferir
    body("senderAccountNumber")
        .isLength({ min: 12, max: 12 })
        .withMessage("El número de cuenta remitente debe tener 12 dígitos"),
    body("recipientAccountNumber")
        .isLength({ min: 12, max: 12 })
        .withMessage("El número de cuenta destinataria debe tener 12 dígitos"),
    body("recipientAccountType")
        .isIn(["AHORRO", "MONETARIA", "CREDITO"])
        .withMessage("Tipo de cuenta inválido"),
    body("amount")
        .isFloat({ min: 0.01, max: 2000 })
        .withMessage("El monto debe ser entre Q0.01 y Q2000"),
    validarCampos,
    handleErrors
];

export const viewAccountDetailsValidator = [
    validateJWT,
    hasRoles("CLIENTE_ROL"), // Solo clientes ven SUS cuentas
    param("accountId").isMongoId().withMessage("ID de cuenta inválido"),
    validarCampos,
    handleErrors
];

export const getAccountHistoryValidator = [
    validateJWT,
    hasRoles("CLIENTE_ROL"),
    param("accountNumber")
        .isLength({ min: 12, max: 12 })
        .withMessage("El número de cuenta debe tener 12 dígitos"),
    validarCampos,
    handleErrors
];

export const getMyAccountsHistoryValidator = [
    validateJWT,
    hasRoles("CLIENTE_ROL"),
    validarCampos,
    handleErrors
];

export const getMyAccountDetailsValidator = [
    validateJWT,
    hasRoles("CLIENTE_ROL"),
    param("accountNumber")
        .isLength({ min: 12, max: 12 })
        .withMessage("El número de cuenta debe tener 12 dígitos"),
    validarCampos,
    handleErrors
];

export const revertMyTransferValidator = [
    validateJWT,
    hasRoles("CLIENTE_ROL"),
    param("transactionId").isMongoId().withMessage("ID de transacción inválido"),
    validarCampos,
    handleErrors
];

// ===== VALIDACIONES PARA ADMIN =====
export const depositFundsValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"), // Solo admin puede depositar
    body("accountNumber")
        .isLength({ min: 12, max: 12 })
        .withMessage("El número de cuenta debe tener 12 dígitos"),
    body("amount")
        .isFloat({ min: 0.01 })
        .withMessage("El monto debe ser mayor a Q0.01"), // Sin límite máximo
    validarCampos,
    handleErrors
];

export const revertDepositValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"), // Solo admin puede revertir
    param("transactionId").isMongoId().withMessage("ID de transacción inválido"),
    validarCampos,
    handleErrors
];

export const getAccountHistoryByAdminValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("accountNumber")
        .isLength({ min: 12, max: 12 })
        .withMessage("El número de cuenta debe tener 12 dígitos"),
    validarCampos,
    handleErrors
];

export const getAllClientsHistoryValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    validarCampos,
    handleErrors
];

export const getDepositsHistoryValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    validarCampos,
    handleErrors
];



