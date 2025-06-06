import bcrypt from 'bcrypt';
import User from "../src/user/user.model.js";

export const crearAdmin = async () => {
    try {
        const adminExistente = await User.findOne({ rol: "admin" });

        if (adminExistente) {
            console.log("Ya existe un administrador en la base de datos.");
            return;
        }

        const adminDatos = {
            nombre: "Admin",
            username: "admin",
            correo: "admin@gmail.com",
            password: "admin",
            rol: "admin", // minúsculas según tu modelo
            celular: "12345678",
            direccion: "Oficina Central",
            nombreTrabajo: "Administrador"
        };

        adminDatos.password = await bcrypt.hash(adminDatos.password, 10);

        const nuevoAdmin = new User(adminDatos);
        await nuevoAdmin.save();

        console.log("Administrador por defecto creado exitosamente.");
    } catch (err) {
        console.error("Error al crear el administrador por defecto:", err.message);
    }
}