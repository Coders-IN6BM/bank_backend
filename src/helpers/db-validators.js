import User from "../user/user.model.js";
import Account from "../account/account.model.js";

export const emailExist = async (email = "") => {
    const existe = await User.findOne({ email });
    if (existe) {
        throw new Error(`The email ${email} is already registered`);
    }
};

export const usernameExist = async (username = "") => {
    const existe = await User.findOne({ username });
    if (existe) {
        throw new Error(`The username ${username} is already registered`);
    }
};

export const userExists = async (dpi = "") => {
    const user = await User.findOne({ DPI: dpi }); 
    if (user) {
        throw new Error(`El DPI ${dpi} ya está registrado`);
    }
};

export const accountExists = async (numAccount = "") => {
    const account = await Account.findOne({ numAccount });
    if (account) {
        throw new Error("La cuenta no existe"); 
    }
};

export const accountIdExists = async (id = "") => {
    const account = await Account.findById(id);
    if (account) {
        throw new Error("Cuenta no encontrada");
    }
};