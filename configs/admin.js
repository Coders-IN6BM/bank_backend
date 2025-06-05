import { hash, verify } from 'argon2';
import Usuarios from "../crs/usuario/user.model.js";

export const crearAdmin = async() =>{
    try{
        const adminExistente = await Usuarios.findOne({ rol: "ADMIN" });

        if (adminExistente) {
            console.log("Ya existe un administrador en la base de datos.");
            return;
        }

        const adminDatos = {
            nombre: "Admin",
            apellido: "PorDefecto",
            username: "admin",
            correo: "admin@gmail.com",
            contra: "admin",
            rol: "ADMIN",
            telefono: "12345678" // Adjust the telefono field to meet the maximum allowed length
        };

        adminDatos.contra = await hash(adminDatos.contra);

        const nuevoAdmin = new Usuarios(adminDatos);
        await nuevoAdmin.save();

        console.log("Administrador por defecto creado exitosamente.");
    }catch(err){
        console.error("Error al crear el administrador por defecto:", err.message);
    }
}