import Account from "./account.model.js";
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

export const getAccountByNumber = async (req, res) => {
    try {
        const { numberAccount } = req.params;

        const account = await Account.findOne({ numberAccount });
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
        res.status(200).json({ accounts }); // Sin return
    } catch (error) {
        res.status(500).json({
            message: "Error fetching accounts",
            error: error.message
        });
    }
};

export const selectAccount = async (req, res) => {
    try {
        const accounts = await Account.find();
        return res.status(200).json({ accounts });
    } catch (err) {
        return res.status(500).json({
            message: "Error fetching accounts",
            error: err.message
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
