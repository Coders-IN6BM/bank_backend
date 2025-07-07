import { Router } from "express";
import { 
    getMyAccounts, 
    editUserProfile, 
    addToFavorites, 
    getFavorites, 
    removeFromFavorites, 
    updateFavoriteAlias 
} from "./user.controller.js";
import { 
    getMyAccountsValidator, 
    editMyProfileValidator,
    addToFavoritesValidator,
    getFavoritesValidator,
    removeFromFavoritesValidator,
    updateFavoriteAliasValidator
} from "../middleware/user-validators.js";

const router = Router();

// Ruta para que el cliente obtenga sus cuentas
router.get("/my-accounts", getMyAccountsValidator, getMyAccounts);

// Ruta para que el cliente edite su perfil
router.put("/my-profile", editMyProfileValidator, editUserProfile);

// ===== RUTAS DE FAVORITOS =====
// Obtener favoritos del usuario
router.get("/favorites", getFavoritesValidator, getFavorites);

// Agregar cuenta a favoritos
router.post("/favorites", addToFavoritesValidator, addToFavorites);

// Eliminar cuenta de favoritos
router.delete("/favorites/:accountNumber", removeFromFavoritesValidator, removeFromFavorites);

// Actualizar alias de favorito
router.put("/favorites/:accountNumber/alias", updateFavoriteAliasValidator, updateFavoriteAlias);

export default router;