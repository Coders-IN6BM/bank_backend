import { body, param } from "express-validator";
import { emailExist, userExists, usernameExist, phoneExists } from "../helpers/db-validators.js";
import { validarCampos } from "./validate-fields.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";
import { handleErrors } from "./handle-error.js";
import User from "../user/user.model.js";

// Función para verificar si el usuario es admin (no puede editar/eliminar otro admin)
const isAdmin = async (id = "") => {
    const user = await User.findById(id);
    if (!user) {
        throw new Error("Usuario no encontrado");
    }
    if (user.rol === 'ADMIN_ROLE') {
        throw new Error("No puedes realizar esta acción sobre otro administrador");
    }
};

// Validadores para registro de usuario (solo ADMIN puede registrar)
export const registerValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    body("name").notEmpty().withMessage("El nombre es requerido").isLength({ max: 25 }).withMessage("El nombre no puede exceder de 25 letras"),
    body("surname").notEmpty().withMessage("El apellido es requerido"),
    body("username").notEmpty().withMessage("El nombre de usuario es requerido").isString().custom(usernameExist),
    body("email").notEmpty().withMessage("El correo es requerido").isEmail().withMessage("El correo debe ser válido").custom(emailExist),
    body("password").notEmpty().withMessage("La contraseña es requerida").isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres"),
    body("dpi").notEmpty().withMessage("El DPI es requerido").isLength({ min: 13, max: 13 }).withMessage("El DPI debe tener exactamente 13 dígitos").custom(userExists),
    body("address").notEmpty().withMessage("La dirección es requerida"),
    body("phone").notEmpty().withMessage("El teléfono es requerido").custom(phoneExists),
    body("nombreTrabajo").notEmpty().withMessage("El nombre del trabajo es requerido"),
    body("ingresosMensuales").optional().isNumeric().withMessage("Los ingresos mensuales deben ser numéricos").isFloat({ min: 100 }).withMessage("Los ingresos mensuales deben ser al menos 100"),
    validarCampos,
    handleErrors
];

// Validadores para login (no requiere autenticación previa)
export const loginValidator = [
    body("email").optional().isEmail().withMessage("El correo debe ser válido"),
    body("username").optional().isString().withMessage("El nombre de usuario debe ser válido"),
    // Validación personalizada para asegurar que se proporcione email o username
    body().custom((value, { req }) => {
        if (!req.body.email && !req.body.username) {
            throw new Error('Debe proporcionar email o nombre de usuario');
        }
        return true;
    }),
    validarCampos,
    handleErrors
];

export const editUserProfileValidator = [
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

// Validadores para el perfil del cliente (editar su propia información)
export const editMyProfileValidator = [
    validateJWT,
    hasRoles("CLIENTE_ROL"),
    body("name").optional().isString().withMessage("El nombre debe ser un texto").isLength({ max: 25 }).withMessage("El nombre no puede exceder de 25 letras"),
    body("address").optional().isString().withMessage("La dirección debe ser un texto"),
    body("nombreTrabajo").optional().isString().withMessage("El nombre del trabajo debe ser un texto"),
    body("ingresosMensuales").optional().isNumeric().withMessage("Los ingresos mensuales deben ser un número").isFloat({ min: 100 }).withMessage("Los ingresos mensuales deben ser al menos 100"),
    validarCampos
];

// Validador para obtener las cuentas del cliente
export const getMyAccountsValidator = [
    validateJWT,
    hasRoles("CLIENTE_ROL"),
    validarCampos
];

// Validadores para favoritos
export const addToFavoritesValidator = [
    validateJWT,
    hasRoles("CLIENTE_ROL"),
    body("accountNumber").notEmpty().withMessage("El número de cuenta es requerido").isString(),
    body("type").optional().isString().withMessage("El tipo debe ser un texto"),
    body("alias").optional().isString().withMessage("El alias debe ser un texto").isLength({ max: 50 }).withMessage("El alias no puede exceder 50 caracteres"),
    validarCampos
];

export const getFavoritesValidator = [
    validateJWT,
    hasRoles("CLIENTE_ROL"),
    validarCampos
];

export const removeFromFavoritesValidator = [
    validateJWT,
    hasRoles("CLIENTE_ROL"),
    param("accountNumber").notEmpty().withMessage("El número de cuenta es requerido").isString(),
    validarCampos
];

export const updateFavoriteAliasValidator = [
    validateJWT,
    hasRoles("CLIENTE_ROL"),
    param("accountNumber").notEmpty().withMessage("El número de cuenta es requerido").isString(),
    body("alias").notEmpty().withMessage("El alias es requerido").isString().isLength({ max: 50 }).withMessage("El alias no puede exceder 50 caracteres"),
    validarCampos
];