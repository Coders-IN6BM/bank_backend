import Transaction from "./transaction.model.js";
import Account from "../account/account.model.js";

export const viewAccountDetails = async (req, res) => {
    try {
        const { accountId } = req.params;

        // Verificar si la cuenta existe
        const account = await Account.findById(accountId);
        if (!account) {
            return res.status(404).json({ message: "Cuenta no encontrada" });
        }

        // Obtener el historial de transacciones
        const transactions = await Transaction.find({ idAccount: accountId }).sort({ date: -1 });

        return res.status(200).json({
            balance: account.balance,
            transactions
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener los detalles de la cuenta", error: error.message });
    }
};

export const transferFunds = async (req, res) => {
    try {
        const { senderAccountId, recipientAccountNumber, recipientAccountType, amount } = req.body;

        // Validar monto máximo por transferencia
        if (amount > 2000) {
            return res.status(400).json({ message: "No puede transferir más de Q2000 por transacción" });
        }

        // Validar que la cuenta remitente exista
        const senderAccount = await Account.findById(senderAccountId);
        if (!senderAccount) {
            return res.status(404).json({ message: "Cuenta remitente no encontrada" });
        }

        // Validar que la cuenta destinataria exista
        const recipientAccount = await Account.findOne({
            numAccount: recipientAccountNumber,
            typeAccount: recipientAccountType
        });
        if (!recipientAccount) {
            return res.status(404).json({ message: "Cuenta destinataria no encontrada" });
        }

        // Validar que el saldo sea suficiente
        if (senderAccount.balance < amount) {
            return res.status(400).json({ message: "Saldo insuficiente para realizar la transferencia" });
        }

        // Validar límite diario de transferencias
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dailyTransfers = await Transaction.find({
            idAccount: senderAccountId,
            type: "DEBIT",
            date: { $gte: today }
        });

        const dailyTotal = dailyTransfers.reduce((sum, transaction) => sum + transaction.amount, 0);
        if (dailyTotal + amount > 10000) {
            return res.status(400).json({ message: "No puede transferir más de Q10,000 por día" });
        }

        // Realizar la transferencia
        senderAccount.balance -= amount;
        recipientAccount.balance += amount;

        await senderAccount.save();
        await recipientAccount.save();

        // Registrar las transacciones
        const senderTransaction = new Transaction({
            idAccount: senderAccountId,
            amount,
            description: `Transferencia a cuenta ${recipientAccountNumber}`,
            type: "DEBIT"
        });

        const recipientTransaction = new Transaction({
            idAccount: recipientAccount._id,
            amount,
            description: `Transferencia recibida de cuenta ${senderAccount.numAccount}`,
            type: "CREDIT"
        });

        await senderTransaction.save();
        await recipientTransaction.save();

        return res.status(200).json({ message: "Transferencia realizada exitosamente" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al realizar la transferencia", error: error.message });
    }
};

export const depositFunds = async (req, res) => {
    try {
        const { accountId, amount } = req.body;

        // Validar que la cuenta exista
        const account = await Account.findById(accountId);
        if (!account) {
            return res.status(404).json({ message: "Cuenta no encontrada" });
        }

        // Realizar el depósito
        account.balance += amount;
        await account.save();

        // Registrar la transacción
        const depositTransaction = new Transaction({
            idAccount: accountId,
            amount,
            description: "Depósito realizado",
            type: "CREDIT"
        });

        const savedTransaction = await depositTransaction.save();

        return res.status(201).json({
            message: "Depósito realizado exitosamente",
            transaction: savedTransaction
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al realizar el depósito", error: error.message });
    }
};

export const revertDeposit = async (req, res) => {
    try {
        const { transactionId } = req.params;

        // Verificar si la transacción existe
        const transaction = await Transaction.findById(transactionId);
        if (!transaction || transaction.type !== "CREDIT") {
            return res.status(404).json({ message: "Transacción no encontrada o no es un depósito" });
        }

        // Verificar si no ha pasado más de 1 minuto
        const now = new Date();
        const transactionTime = new Date(transaction.createdAt);
        const timeDifference = (now - transactionTime) / 1000; // Diferencia en segundos

        if (timeDifference > 60) {
            return res.status(400).json({ message: "No se puede revertir el depósito después de 1 minuto" });
        }

        // Revertir el depósito
        const account = await Account.findById(transaction.idAccount);
        if (!account) {
            return res.status(404).json({ message: "Cuenta no encontrada" });
        }

        account.balance -= transaction.amount;
        await account.save();

        // Marcar la transacción como revertida
        transaction.description += " (Revertido)";
        await transaction.save();

        return res.status(200).json({ message: "Depósito revertido exitosamente" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al revertir el depósito", error: error.message });
    }
};