import { Router } from "express";
import { transferFunds, depositFunds, revertDeposit, getAccountHistory, getMyAccountsHistory, getDepositsHistory, getMyAccountDetails, getAccountHistoryByAdmin, getAllClientsHistory, revertMyTransfer } from "./transaction.controller.js";
import { transferFundsValidator, depositFundsValidator, revertDepositValidator, getAccountHistoryValidator, getMyAccountsHistoryValidator, getDepositsHistoryValidator, getMyAccountDetailsValidator, getAccountHistoryByAdminValidator, getAllClientsHistoryValidator, revertMyTransferValidator } from "../middleware/transaction-validators.js";

const router = Router();

router.get("/my-account/:accountNumber", getMyAccountDetailsValidator, getMyAccountDetails);

router.get("/history/:accountNumber", getAccountHistoryValidator, getAccountHistory);

router.get("/my-recent-transfers", getMyAccountsHistoryValidator, getMyAccountsHistory);

router.post("/transfer", transferFundsValidator, transferFunds);

router.put("/revert-my-transfer/:transactionId", revertMyTransferValidator, revertMyTransfer);

router.get("/admin/account/:accountNumber/history", getAccountHistoryByAdminValidator, getAccountHistoryByAdmin);

router.get("/admin/all-clients-history", getAllClientsHistoryValidator, getAllClientsHistory);

router.get("/admin/all-transfers", getAllClientsHistoryValidator, getAllClientsHistory);

router.post("/admin/deposit", depositFundsValidator, depositFunds);

router.get("/admin/deposits-history", getDepositsHistoryValidator, getDepositsHistory);

router.put("/admin/revert-deposit/:transactionId", revertDepositValidator, revertDeposit);

export default router;
