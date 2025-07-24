import User from "../src/user/user.model.js";
import { hash } from "argon2";

export const crearAdmin = async () => {
  try {
    const adminExists = await User.findOne({ rol: "ADMIN_ROLE" });

    if (adminExists) {
      console.log("Admin already exists. Skipping creation.");
      return;
    }
    const hashedPassword = await hash("ADMINB"); 
    const adminUser = new User({
      name: "Admin",
      surname:"Bro",
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