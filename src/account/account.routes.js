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

/**
 * @swagger
 * /addAccount:
 *   post:
 *     summary: Add a new account
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountName:
 *                 type: string
 *               initialBalance:
 *                 type: number
 *     responses:
 *       201:
 *         description: Account created successfully
 *       400:
 *         description: Validation error
 */
router.post("/addAccount", addAccountValidator, addAccount);

/**
 * @swagger
 * /getAccountById/{uid}:
 *   get:
 *     summary: Get account by ID
 *     tags: [Account]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account details
 *       404:
 *         description: Account not found
 */
router.get("/getAccountById/:uid", getAccountByIdValidator, getAccountById);

/**
 * @swagger
 * /getAccountByNumber/{numAccount}:
 *   get:
 *     summary: Get account by account number
 *     tags: [Account]
 *     parameters:
 *       - in: path
 *         name: numAccount
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account details
 *       404:
 *         description: Account not found
 */
router.get("/getAccountByNumber/:numAccount", getAccountByNumberValidator, getAccountByNumber);

/**
 * @swagger
 * /getAllAccountsByAdmin:
 *   get:
 *     summary: Get all accounts by admin
 *     tags: [Account]
 *     responses:
 *       200:
 *         description: List of accounts
 *       403:
 *         description: Unauthorized
 */
router.get("/getAllAccountsByAdmin", getAllAccountsValidator, getAccountsByAdmin);

/**
 * @swagger
 * /selectAccount:
 *   get:
 *     summary: Select an account
 *     tags: [Account]
 *     responses:
 *       200:
 *         description: Account selected successfully
 *       400:
 *         description: Validation error
 */
router.get("/selectAccount", selectAccountValidator, selectAccount);

export default router;