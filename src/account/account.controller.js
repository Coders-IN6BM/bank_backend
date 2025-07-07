import Account from "./account.model.js";
import User from "../user/user.model.js";
import Transaction from "../transaction/transaction.model.js";
import { generateUniqueAccountNumber } from "../utils/generateAccount.js"; 

export const addAccount = async (req, res) => {
    try {
        const { typeAccount, status } = req.body;
        const idUser = req.usuario._id;

        const numAccount = generateUniqueAccountNumber();

        const newAccount = new Account({
            idUser,
            numAccount,
            typeAccount,
            balance: 0,
            status
        });

        const savedAccount = await newAccount.save();

        res.status(201).json({
            message: "Cuenta creada exitosamente",
            account: savedAccount
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al crear la cuenta",
            error: error.message
        });
    }
};

export const getAccountById = async (req, res) => {
    try {
        const { uid } = req.params;
        const account = await Account.findById(uid);
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }
        return res.status(200).json({ account });
    } catch (err) {
        return res.status(500).json({
            message: "Error fetching account",
            error: err.message
        });
    }
};

export const getAccountByNumber = async (req, res) => {
    try {
        const { numAccount } = req.params;

        const account = await Account.findOne({ numAccount });
        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            });
        }

        res.status(200).json({ account });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching account",
            error: error.message
        });
    }
};

export const getMyAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({
            idUser: req.usuario._id,
            status: true
        });

        res.status(200).json({ accounts });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching accounts",
            error: error.message
        });
    }
};

export const getAccountsByAdmin = async (req, res) => {
    try {
        const accounts = await Account.find();
        res.status(200).json({ accounts }); 
    } catch (error) {
        res.status(500).json({
            message: "Error fetching accounts",
            error: error.message
        });
    }
};

export const getUserAccountDetails = async (req, res) => {
    try {
        const { userId } = req.params; // ID del usuario que se quiere consultar

        // Verificar si el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Obtener las cuentas del usuario
        const accounts = await Account.find({ idUser: userId });

        // Obtener los últimos 5 movimientos de cada cuenta
        const movimientos = await Promise.all(
            accounts.map(async (account) => {
                const transactions = await Transaction.find({ idAccount: account._id })
                    .sort({ date: -1 }) // Ordenar por fecha descendente
                    .limit(5); // Limitar a los últimos 5 movimientos
                return {
                    numAccount: account.numAccount,
                    transactions
                };
            })
        );

        return res.status(200).json({
            user: {
                name: user.name,
                surname: user.surname,
                email: user.email
            },
            accounts,
            movimientos,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

export const selectAccount = async (req, res) => {
    try {
        const { numAccount } = req.query; 
        
        if (!numAccount) {
            return res.status(400).json({
                message: "Debe proporcionar un número de cuenta"
            });
        }

        const account = await Account.findOne({ numAccount })
            .select("numAccount typeAccount") 
            .populate("idUser"); 

        if (!account) {
            return res.status(404).json({
                message: "No se encontró una cuenta con ese número"
            });
        }
        return res.status(200).json({
            account: {
                numAccount: account.numAccount,
                type: account.typeAccount,
                user: account.idUser 
            }
        });

    } catch (err) {
        return res.status(500).json({
            message: "Error al buscar la cuenta",
            error: err.message
        });
    }
};