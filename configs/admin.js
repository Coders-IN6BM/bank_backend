import { hash } from "argon2";
import User from "../src/user/user.model.js";

export const crearAdmin = async () => {
    try {
        const adminExistente = await User.findOne({ rol: "ADMIN_ROLE" });
        if (!adminExistente) {
            await User.create({
                name: "AdminBro",
                username: "ADMINB",
                email: "admin@example.com",
                password: await hash("ADMINB"),
                profilePicture: null,
                phone: "12345678",
                address: "Oficina Central",
                nombreTrabajo: "Administrador",
                rol: "ADMIN_ROLE",
                ingresosMensuales: 0,
                saldo: 0
            });
            console.log("Usuario ADMIN por defecto creado.");
        } else {
            console.log("El usuario ADMIN ya existe.");
        }
    } catch (err) {
        console.error("Error al crear el usuario ADMIN por defecto:", err.message);
    }
};