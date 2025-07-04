import { hash, verify } from "argon2";
import User from "./user.model.js";
import Account from "../account/account.model.js";

// Función para que el cliente acceda a sus cuentas
export const getMyAccounts = async (req, res) => {
    try {
        const userId = req.usuario._id; // ID del usuario autenticado

        // Obtener las cuentas asociadas al usuario
        const accounts = await Account.find({ idUser: userId });

        if (!accounts || accounts.length === 0) {
            return res.status(404).json({ message: "No se encontraron cuentas asociadas a este usuario" });
        }

        return res.status(200).json({ accounts });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener las cuentas", error: error.message });
    }
};

// Función para que el cliente edite su información personal
export const editUserProfile = async (req, res) => {
    try {
        const userId = req.usuario._id; // ID del usuario autenticado
        const { name, address, nombreTrabajo, ingresosMensuales } = req.body;

        // Validar que al menos uno de los campos esté presente
        if (!name && !address && !nombreTrabajo && !ingresosMensuales) {
            return res.status(400).json({ message: "Debe proporcionar al menos un campo para actualizar" });
        }

        // Actualizar los campos proporcionados
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, address, nombreTrabajo, ingresosMensuales },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        return res.status(200).json({
            message: "Perfil actualizado exitosamente",
            user: updatedUser
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al actualizar el perfil", error: error.message });
    }
};