import { hash, verify } from "argon2";
import { generateJWT } from "../helpers/generate-jwt.js";
import { generarNumeroCuenta } from "../helpers/accountGenerator.js";
import User from "../user/user.model.js";

export const login = async (req, res) => {
    const { email, username, password } = req.body;
    
    try {
        const user = await User.findOne({ $or: [{ email }, { username }] }).select('+password');
        
        if (!user || !(await verify(user.password, password))) {
            return res.status(400).json({ 
                message: "Credenciales inválidas" 
            });
        }

        const token = await generateJWT(user._id);
        
        return res.status(200).json({
            token,
            user: {
                uid: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                rol: user.rol,
                numAccount: user.numAccount
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const registerUser = async (req, res) => {
    try {
        const userData = req.body;
        userData.numAccount = await generarNumeroCuenta();
        userData.password = await hash(userData.password);
        userData.rol = 'CLIENTE_ROL';

        const newUser = await User.create(userData);
        const token = await generateJWT(newUser._id);

        return res.status(201).json({
            token,
            user: {
                uid: newUser._id,
                name: newUser.name,
                surname: newUser.surname,
                email: newUser.email,
                rol: newUser.rol,
                numAccount: newUser.numAccount,
                createdAt: newUser.createdAt
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};