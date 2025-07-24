import Transaction from "./transaction.model.js";
import Account from "../account/account.model.js";

// Transferir usuario-usuario
export const transferFunds = async (req, res) => {
    try {
        const { senderAccountNumber, recipientAccountNumber, recipientAccountType, amount } = req.body;
        const userId = req.usuario._id;

        const senderAccount = await Account.findOne({ 
            numAccount: senderAccountNumber, 
            idUser: userId 
        });
        if (!senderAccount) {
            return res.status(404).json({ message: "Cuenta remitente no encontrada o no tienes permisos para usarla" });
        }

        const recipientAccount = await Account.findOne({
            numAccount: recipientAccountNumber,
            typeAccount: recipientAccountType
        });
        if (!recipientAccount) {
            return res.status(404).json({ message: "Cuenta destinataria no encontrada" });
        }

        if (senderAccount.numAccount === recipientAccount.numAccount) {
            return res.status(400).json({ message: "No puedes transferir a la misma cuenta" });
        }

        if (senderAccount.balance < amount) {
            return res.status(400).json({ message: "Saldo insuficiente para realizar la transferencia" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dailyTransfers = await Transaction.find({
            idAccount: senderAccount._id,
            type: "DEBIT",
            date: { $gte: today }
        });

        const dailyTotal = dailyTransfers.reduce((sum, transaction) => sum + transaction.amount, 0);
        if (dailyTotal + amount > 10000) {
            return res.status(400).json({ message: "No puede transferir más de Q10,000 por día" });
        }

        senderAccount.balance -= amount;
        recipientAccount.balance += amount;

        await senderAccount.save();
        await recipientAccount.save();

        const senderTransaction = new Transaction({
            idAccount: senderAccount._id,
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

        return res.status(200).json({
            message: "Transferencia realizada exitosamente",
            newBalance: senderAccount.balance,
            fromAccount: senderAccount.numAccount,
            toAccount: recipientAccountNumber
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al realizar la transferencia", error: error.message });
    }
};

// Depositar Admin
export const depositFunds = async (req, res) => {
    try {
        const { accountNumber, amount } = req.body;
        const adminName = req.usuario.name;

        const account = await Account.findOne({ numAccount: accountNumber }).populate('idUser', 'name surname');
        if (!account) {
            return res.status(404).json({ message: "Cuenta no encontrada" });
        }

        if (!account.status) {
            return res.status(400).json({ message: "No se puede depositar en una cuenta inactiva" });
        }

        account.balance += amount;
        await account.save();

        const depositTransaction = new Transaction({
            idAccount: account._id,
            amount,
            description: `Depósito bancario realizado por ${adminName}`,
            type: "CREDIT"
        });

        const savedTransaction = await depositTransaction.save();

        return res.status(201).json({
            message: "Depósito realizado exitosamente",
            accountNumber: account.numAccount,
            newBalance: account.balance,
            transaction: savedTransaction,
            accountHolder: `${account.idUser.name} ${account.idUser.surname}`
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al realizar el depósito", error: error.message });
    }
};

// Revertir depósito ADMIN
export const revertDeposit = async (req, res) => {
    try {
        const { transactionId } = req.params;

        const transaction = await Transaction.findById(transactionId);
        if (!transaction || transaction.type !== "CREDIT" || !transaction.description.includes("Depósito bancario")) {
            return res.status(404).json({ message: "Transacción no encontrada o no es un depósito bancario" });
        }

        const now = new Date();
        const transactionTime = new Date(transaction.createdAt);
        const timeDifference = (now - transactionTime) / 1000; // Diferencia en segundos

        if (timeDifference > 60) {
            return res.status(400).json({ message: "No se puede revertir el depósito después de 1 minuto" });
        }

        const account = await Account.findById(transaction.idAccount);
        if (!account) {
            return res.status(404).json({ message: "Cuenta no encontrada" });
        }

        if (account.balance < transaction.amount) {
            return res.status(400).json({ message: "La cuenta no tiene saldo suficiente para revertir el depósito" });
        }

        account.balance -= transaction.amount;
        await account.save();

        transaction.description += " (REVERTIDO POR ADMIN)";
        await transaction.save();

        return res.status(200).json({ 
            message: "Depósito revertido exitosamente",
            revertedAmount: transaction.amount,
            newBalance: account.balance
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al revertir el depósito", error: error.message });
    }
};

// Ver historial de la cuenta
export const getAccountHistory = async (req, res) => {
    try {
        const { accountNumber } = req.params;
        const userId = req.usuario._id;

        const account = await Account.findOne({ 
            numAccount: accountNumber, 
            idUser: userId 
        }).populate('idUser', 'name surname');

        if (!account) {
            return res.status(404).json({ 
                message: "Cuenta no encontrada o no tienes permisos para verla" 
            });
        }

        const transactions = await Transaction.find({ idAccount: account._id })
            .sort({ createdAt: -1 });

        const deposits = transactions.filter(t => t.type === "CREDIT" && t.description.includes("Depósito bancario"));
        const transfers = transactions.filter(t => !t.description.includes("Depósito bancario"));

        return res.status(200).json({
            account: {
                number: account.numAccount,
                type: account.typeAccount,
                balance: account.balance,
                owner: `${account.idUser.name} ${account.idUser.surname}`
            },
            summary: {
                totalTransactions: transactions.length,
                totalDeposits: deposits.length,
                totalTransfers: transfers.length,
                totalCredits: transactions.filter(t => t.type === "CREDIT").length,
                totalDebits: transactions.filter(t => t.type === "DEBIT").length
            },
            transactions
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: "Error al obtener el historial", 
            error: error.message 
        });
    }
};

// Ver historial de las cuentas del usuario
export const getMyAccountsHistory = async (req, res) => {
    try {
        const userId = req.usuario._id;
        const { limit = 10, page = 1 } = req.query;

        const accounts = await Account.find({ idUser: userId });

        if (!accounts.length) {
            return res.status(404).json({ 
                message: "No se encontraron cuentas asociadas" 
            });
        }

        const accountIds = accounts.map(acc => acc._id);

        const skip = (page - 1) * limit;
        const transactions = await Transaction.find({ 
            idAccount: { $in: accountIds } 
        })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip);

        const transactionsWithAccount = transactions.map(transaction => {
            const account = accounts.find(acc => acc._id.toString() === transaction.idAccount.toString());
            return {
                ...transaction.toObject(),
                accountInfo: {
                    number: account.numAccount,
                    type: account.typeAccount
                }
            };
        });

        const totalTransactions = await Transaction.countDocuments({ 
            idAccount: { $in: accountIds } 
        });

        return res.status(200).json({
            accounts: accounts.map(acc => ({
                number: acc.numAccount,
                type: acc.typeAccount,
                balance: acc.balance
            })),
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalTransactions / limit),
                totalTransactions,
                limit: parseInt(limit)
            },
            transactions: transactionsWithAccount
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: "Error al obtener el historial", 
            error: error.message 
        });
    }
};

// Ver historial de los depósitos 
export const getDepositsHistory = async (req, res) => {
    try {
        const { limit = 20, page = 1 } = req.query;
        const skip = (page - 1) * limit;

        const deposits = await Transaction.find({ 
            type: "CREDIT",
            description: { $regex: "Depósito bancario" }
        })
        .populate({
            path: 'idAccount',
            select: 'numAccount typeAccount',
            populate: {
                path: 'idUser',
                select: 'name surname email'
            }
        })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip);

        const totalDeposits = await Transaction.countDocuments({ 
            type: "CREDIT",
            description: { $regex: "Depósito bancario" }
        });

        return res.status(200).json({
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalDeposits / limit),
                totalDeposits,
                limit: parseInt(limit)
            },
            deposits: deposits.map(deposit => ({
                id: deposit._id,
                amount: deposit.amount,
                description: deposit.description,
                date: deposit.createdAt,
                account: {
                    number: deposit.idAccount.numAccount,
                    type: deposit.idAccount.typeAccount,
                    owner: `${deposit.idAccount.idUser.name} ${deposit.idAccount.idUser.surname}`
                }
            }))
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: "Error al obtener historial de depósitos", 
            error: error.message 
        });
    }
};

// Ver historial de las últimas 5 transacciones 
export const getMyAccountDetails = async (req, res) => {
    try {
        const { accountNumber } = req.params;
        const userId = req.usuario._id;

        const account = await Account.findOne({ 
            numAccount: accountNumber, 
            idUser: userId 
        }).populate('idUser', 'name surname');

        if (!account) {
            return res.status(404).json({ 
                message: "Cuenta no encontrada o no tienes permisos para verla" 
            });
        }

        const transactions = await Transaction.find({ idAccount: account._id })
            .sort({ createdAt: -1 })
            .limit(5);

        return res.status(200).json({
            account: {
                number: account.numAccount,
                type: account.typeAccount,
                balance: account.balance,
                owner: `${account.idUser.name} ${account.idUser.surname}`
            },
            recentTransactions: transactions,
            message: "Mostrando las últimas 5 transacciones. Para ver el historial completo, use la función de historial."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: "Error al obtener los detalles de la cuenta", 
            error: error.message 
        });
    }
};

// Ver historial de cualquier cuenta ADMIN
export const getAccountHistoryByAdmin = async (req, res) => {
    try {
        const { accountNumber } = req.params;

        const account = await Account.findOne({ numAccount: accountNumber })
            .populate('idUser', 'name surname email username');

        if (!account) {
            return res.status(404).json({ 
                message: "Cuenta no encontrada" 
            });
        }

        const transactions = await Transaction.find({ idAccount: account._id })
            .sort({ createdAt: -1 });

        const deposits = transactions.filter(t => t.type === "CREDIT" && t.description.includes("Depósito bancario"));
        const transfers = transactions.filter(t => !t.description.includes("Depósito bancario"));

        return res.status(200).json({
            account: {
                id: account._id,
                number: account.numAccount,
                type: account.typeAccount,
                balance: account.balance,
                status: account.status,
                owner: {
                    name: `${account.idUser.name} ${account.idUser.surname}`,
                    email: account.idUser.email,
                    username: account.idUser.username
                }
            },
            summary: {
                totalTransactions: transactions.length,
                totalDeposits: deposits.length,
                totalTransfers: transfers.length,
                totalCredits: transactions.filter(t => t.type === "CREDIT").length,
                totalDebits: transactions.filter(t => t.type === "DEBIT").length,
                totalAmountIn: transactions.filter(t => t.type === "CREDIT").reduce((sum, t) => sum + t.amount, 0),
                totalAmountOut: transactions.filter(t => t.type === "DEBIT").reduce((sum, t) => sum + t.amount, 0)
            },
            transactions
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: "Error al obtener el historial", 
            error: error.message 
        });
    }
};

// Ver historial de todos los clientes ADMIN
export const getAllClientsHistory = async (req, res) => {
    try {
        const { limit = 20, page = 1, userId, accountType } = req.query;
        const skip = (page - 1) * limit;

        let accountFilter = {};
        if (userId) accountFilter.idUser = userId;
        if (accountType) accountFilter.typeAccount = accountType;

        const accounts = await Account.find(accountFilter)
            .populate('idUser', 'name surname email username')
            .sort({ createdAt: -1 });

        if (!accounts.length) {
            return res.status(404).json({ 
                message: "No se encontraron cuentas con los filtros especificados" 
            });
        }

        const accountIds = accounts.map(acc => acc._id);

        const transactions = await Transaction.find({ 
            idAccount: { $in: accountIds } 
        })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip);

        const transactionsWithDetails = transactions.map(transaction => {
            const account = accounts.find(acc => acc._id.toString() === transaction.idAccount.toString());
            return {
                ...transaction.toObject(),
                accountInfo: {
                    number: account.numAccount,
                    type: account.typeAccount,
                    owner: `${account.idUser.name} ${account.idUser.surname}`,
                    email: account.idUser.email
                }
            };
        });

        const totalTransactions = await Transaction.countDocuments({ 
            idAccount: { $in: accountIds } 
        });

        const stats = await Transaction.aggregate([
            { $match: { idAccount: { $in: accountIds } } },
            {
                $group: {
                    _id: null,
                    totalCredits: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0]
                        }
                    },
                    totalDebits: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0]
                        }
                    },
                    totalCreditCount: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "CREDIT"] }, 1, 0]
                        }
                    },
                    totalDebitCount: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "DEBIT"] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        return res.status(200).json({
            filters: {
                userId: userId || "Todos",
                accountType: accountType || "Todos"
            },
            statistics: stats[0] || {
                totalCredits: 0,
                totalDebits: 0,
                totalCreditCount: 0,
                totalDebitCount: 0
            },
            accounts: accounts.map(acc => ({
                id: acc._id,
                number: acc.numAccount,
                type: acc.typeAccount,
                balance: acc.balance,
                status: acc.status,
                owner: `${acc.idUser.name} ${acc.idUser.surname}`
            })),
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalTransactions / limit),
                totalTransactions,
                limit: parseInt(limit)
            },
            transactions: transactionsWithDetails
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: "Error al obtener el historial de clientes", 
            error: error.message 
        });
    }
};

// Revertir mi propia transferencia
export const revertMyTransfer = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const userId = req.usuario._id;

        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: "Transacción no encontrada" });
        }

        if (transaction.type !== "DEBIT") {
            return res.status(400).json({ message: "Solo puedes revertir transferencias que hayas enviado" });
        }

        if (transaction.description.includes("Depósito bancario")) {
            return res.status(400).json({ message: "No puedes revertir depósitos bancarios" });
        }

        const senderAccount = await Account.findById(transaction.idAccount);
        if (!senderAccount || senderAccount.idUser.toString() !== userId.toString()) {
            return res.status(403).json({ message: "No tienes permisos para revertir esta transferencia" });
        }

        const now = new Date();
        const transactionTime = new Date(transaction.createdAt);
        const timeDifference = (now - transactionTime) / 1000;

        if (timeDifference > 300) { 
            return res.status(400).json({ message: "No se puede revertir la transferencia después de 5 minutos" });
        }

        const recipientTransaction = await Transaction.findOne({
            amount: transaction.amount,
            type: "CREDIT",
            description: { $regex: "Transferencia recibida" },
            createdAt: { 
                $gte: new Date(transactionTime.getTime() - 1000), 
                $lte: new Date(transactionTime.getTime() + 1000)  
            }
        });

        if (!recipientTransaction) {
            return res.status(404).json({ message: "No se encontró la transferencia completa para revertir" });
        }

        const recipientAccount = await Account.findById(recipientTransaction.idAccount);
        if (!recipientAccount) {
            return res.status(404).json({ message: "Cuenta destinataria no encontrada" });
        }

        if (recipientAccount.balance < transaction.amount) {
            return res.status(400).json({ 
                message: "El destinatario no tiene saldo suficiente para revertir la transferencia" 
            });
        }

        senderAccount.balance += transaction.amount;  
        recipientAccount.balance -= transaction.amount;  

        await senderAccount.save();
        await recipientAccount.save();

        transaction.description += " (REVERTIDA POR CLIENTE)";
        recipientTransaction.description += " (REVERTIDA POR CLIENTE)";

        await transaction.save();
        await recipientTransaction.save();

        return res.status(200).json({ 
            message: "Transferencia revertida exitosamente",
            revertedAmount: transaction.amount,
            newBalance: senderAccount.balance,
            fromAccount: senderAccount.numAccount,
            toAccount: recipientAccount.numAccount
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al revertir la transferencia", error: error.message });
    }
};