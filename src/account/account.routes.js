import { Router } from "express";
import { 
    addAccount, 
    getAccountById, 
    getAccountByNumber, 
    getAccountsByAdmin,
    selectAccount
} from "./account.controller.js";
import { 
    addAccountValidator,
    getAccountByIdValidator,
    getAccountByNumberValidator,
    getAllAccountsValidator,
    selectAccountValidator
} from "../middleware/account-validators.js";

const router = Router();

router.post("/addAccount", addAccountValidator, addAccount);

router.get("/getAccountById/:uid", getAccountByIdValidator, getAccountById);

router.get("/getAccountByNumber/:numAccount", getAccountByNumberValidator, getAccountByNumber);

router.get("/getAllAccountsByAdmin", getAllAccountsValidator, getAccountsByAdmin);

router.get("/selectAccount", selectAccountValidator, selectAccount);

export default router;