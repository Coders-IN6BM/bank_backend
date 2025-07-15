import { hash, verify } from "argon2";
import User from "./user.model.js";
import Account from "../account/account.model.js";

export const getMyAccounts = async (req, res) => {
    try {
        const userId = req.usuario._id; 

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

export const editUserProfile = async (req, res) => {
    try {
        const userId = req.usuario._id; 
        const { name, address, nombreTrabajo, ingresosMensuales } = req.body;

        if (!name && !address && !nombreTrabajo && !ingresosMensuales) {
            return res.status(400).json({ message: "Debe proporcionar al menos un campo para actualizar" });
        }

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

export const addToFavorites = async (req, res) => {
    try {
        const userId = req.usuario._id;
        const { accountNumber, type, alias } = req.body;

        const account = await Account.findOne({ numAccount: accountNumber });
        if (!account) {
            return res.status(404).json({ message: "La cuenta no existe" });
        }

        if (account.idUser.toString() === userId.toString()) {
            return res.status(400).json({ message: "No puedes agregar tu propia cuenta a favoritos" });
        }

        const user = await User.findById(userId);
        const existingFavorite = user.favorites.find(fav => fav.accountNumber === accountNumber);
        
        if (existingFavorite) {
            return res.status(400).json({ message: "Esta cuenta ya está en tus favoritos" });
        }

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

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ rol: 'CLIENTE_ROL' })
            .select('_id name surname email username')
            .sort({ name: 1 });

        return res.status(200).json({
            message: "Lista de usuarios obtenida exitosamente",
            users
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
    }
};