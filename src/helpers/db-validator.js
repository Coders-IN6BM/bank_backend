import User from "../user/user.model.js";


export const correoExists = async (email = "") => {
    const existe = await User.findOne({ email });
    if (existe) {
        throw new Error(`The email ${email} is already registered`);
    }
};


export const usernameExists = async (username = "") => {
    const existe = await User.findOne({ username });
    if (existe) {
        throw new Error(`The username ${username} is already registered`);
    }
};


export const userExists = async (uid = "") => {
    const existe = await User.findById(uid);
    if (!existe) {
        throw new Error("No existe el usuario con el ID proporcionado");
    }
};


export const telephoneExists = async (telephone = "") => {
    const existe = await User.findOne({ telephone });
    if (existe) {
        throw new Error(`User: ${telephone}, is already registered`);
    }
};