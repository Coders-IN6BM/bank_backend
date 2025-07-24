import { Router } from "express";
import { getMyAccounts, editUserProfile, addToFavorites, getFavorites, removeFromFavorites, updateFavoriteAlias, getAllUsers } from "./user.controller.js";
import { getMyAccountsValidator, editMyProfileValidator, addToFavoritesValidator, getFavoritesValidator, removeFromFavoritesValidator, updateFavoriteAliasValidator, listarUsersValidator } from "../middleware/user-validators.js";

const router = Router();

router.get("/my-accounts", getMyAccountsValidator, getMyAccounts);

router.put("/my-profile", editMyProfileValidator, editUserProfile);

router.get("/favorites", getFavoritesValidator, getFavorites);

router.post("/favorites", addToFavoritesValidator, addToFavorites);

router.delete("/favorites/:accountNumber", removeFromFavoritesValidator, removeFromFavorites);

router.put("/favorites/:accountNumber/alias", updateFavoriteAliasValidator, updateFavoriteAlias);

router.get("/all-users", listarUsersValidator, getAllUsers);

export default router;