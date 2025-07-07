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

// Función para agregar una cuenta a favoritos
export const addToFavorites = async (req, res) => {
    try {
        const userId = req.usuario._id;
        const { accountNumber, type, alias } = req.body;

        // Verificar que la cuenta existe
        const account = await Account.findOne({ numAccount: accountNumber });
        if (!account) {
            return res.status(404).json({ message: "La cuenta no existe" });
        }

        // Verificar que no sea su propia cuenta
        if (account.idUser.toString() === userId.toString()) {
            return res.status(400).json({ message: "No puedes agregar tu propia cuenta a favoritos" });
        }

        // Verificar que no esté ya en favoritos
        const user = await User.findById(userId);
        const existingFavorite = user.favorites.find(fav => fav.accountNumber === accountNumber);
        
        if (existingFavorite) {
            return res.status(400).json({ message: "Esta cuenta ya está en tus favoritos" });
        }

        // Agregar a favoritos
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                $push: { 
                    favorites: { 
                        accountNumber, 
                        type: type || account.typeAccount,
                        alias: alias || `Cuenta ${accountNumber.slice(-4)}`
                    } 
                } 
            },
            { new: true }
        );

        return res.status(200).json({
            message: "Cuenta agregada a favoritos exitosamente",
            favorites: updatedUser.favorites
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al agregar a favoritos", error: error.message });
    }
};

// Función para obtener favoritos del usuario
export const getFavorites = async (req, res) => {
    try {
        const userId = req.usuario._id;
        
        const user = await User.findById(userId).select('favorites');
        
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        return res.status(200).json({
            favorites: user.favorites
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener favoritos", error: error.message });
    }
};

// Función para eliminar una cuenta de favoritos
export const removeFromFavorites = async (req, res) => {
    try {
        const userId = req.usuario._id;
        const { accountNumber } = req.params;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                $pull: { 
                    favorites: { accountNumber } 
                } 
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        return res.status(200).json({
            message: "Cuenta eliminada de favoritos exitosamente",
            favorites: updatedUser.favorites
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al eliminar de favoritos", error: error.message });
    }
};

// Función para actualizar alias de un favorito
export const updateFavoriteAlias = async (req, res) => {
    try {
        const userId = req.usuario._id;
        const { accountNumber } = req.params;
        const { alias } = req.body;

        if (!alias) {
            return res.status(400).json({ message: "El alias es requerido" });
        }

        const updatedUser = await User.findOneAndUpdate(
            { 
                _id: userId, 
                "favorites.accountNumber": accountNumber 
            },
            { 
                $set: { 
                    "favorites.$.alias": alias 
                } 
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario o cuenta favorita no encontrada" });
        }

        return res.status(200).json({
            message: "Alias actualizado exitosamente",
            favorites: updatedUser.favorites
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al actualizar alias", error: error.message });
    }
};