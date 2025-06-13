import User from "../src/user/user.model.js";
import { hash } from "argon2";

export const crearAdmin = async () => {
  try {
    // Verificar si ya existe un administrador
    const adminExists = await User.findOne({ rol: "ADMIN_ROLE" });

    if (adminExists) {
      console.log("Admin already exists. Skipping creation.");
      return;
    }

    // Crear un administrador por defecto
    const hashedPassword = await hash("ADMINB"); // Contraseña encriptada
    const adminUser = new User({
      name: "AdminBro",
      username: "ADMINB",
      email: "admin@example.com",
      password: hashedPassword,
      rol: "ADMIN_ROLE",
      address: "Default Address",
      phone: "12345678",
      nombreTrabajo: "Admin",
      ingresosMensuales: 0,
    });

    await adminUser.save();
    console.log("Default admin created successfully.");
  } catch (err) {
    console.error("Error creating default admin:", err);
  }
};