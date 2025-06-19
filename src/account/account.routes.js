import { Router } from "express";
import { addAccount, getAccountById, getAccountByNumber, getMyAccounts, getAccountsByAdmin } from "./account.controller.js";
import { } from "../middlewares/account-validator.js";
import { generateUniqueAccountNumber } from "../utils/generateAccount.js"
const router = Router();

router.post("/addAccount", addAccount, generateUniqueAccountNumber);

router.get("/getAccountById/:uid", getAccountById);

router.get("/getAccountByNumber/:numberAccount", getAccountByNumber);

router.get("/getMyAccounts", getMyAccounts);

router.get("/getAllAccountsByAdmin", getAccountsByAdmin);

router.get("/selectAccount", selectAccountValidator, selectAccount);

export default router;