import User from "../user/user.model.js";

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
    const user = await User.findOne({ DPI: dpi }); // Buscar por el campo DPI
    if (user) {
        throw new Error(`El DPI ${dpi} ya está registrado`);
    }
};

export const telephoneExists = async (telephone = "") => {
    const existe = await User.findOne({ telephone });
    if (existe) {
        throw new Error(`User: ${telephone}, is already registered`);
    }
};

// Nueva función para verificar si un usuario es administrador
export const isAdmin = async (id = "") => {
    const user = await User.findById(id);
    if (user && user.rol === "ADMIN_ROLE") {
        throw new Error("No puedes realizar esta acción sobre un administrador");
    }
};