import { hash, verify } from "argon2";
import { generateJWT } from "../helpers/generate-jwt.js";
import User from "../user/user.model.js";

export const login = async (req, res) => {
  const { email, username, password } = req.body;
  try {
      const user = await User.findOne({
          $or: [{ email: email }, { username: username }]
      });

      if (!user) {
          return res.status(400).json({
              message: "Invalid credentials",
              error: "The provided email or username does not exist"
          });
      }

      const validPassword = await verify(user.password, password);

      if (!validPassword) {
          return res.status(400).json({
              message: "Invalid credentials",
              error: "Incorrect password"
          });
      }

      const token = await generateJWT(user.id);

      return res.status(200).json({
          message: "Login successful",
          userDetails: {
              token: token,
              profilePicture: user.profilePicture
          }
      });
  } catch (err) {
      console.error("Error en el login:", err); 
      return res.status(500).json({
          message: "Login failed due to server error",
          error: err.message || "Unknown error"
      });
  }
};

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      dpi,
      address,
      phone,
      nombreTrabajo,
      ingresosMensuales
    } = req.body;

    // Verificar si se subió una foto de perfil
    const profilePicture = req.file ? req.file.filename : null;

    // Generar número único para la cuenta
    const nameAccount = generarNumeroCuenta();

    // Encriptar la contraseña
    const hashedPassword = await hash(password);

    // Crear el nuevo usuario
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      dpi: dpi,
      address,
      phone,
      nombreTrabajo,
      ingresosMensuales,
      nameAccount,
      profilePicture // Asignar la foto de perfil
    });

    await newUser.save();

    return res.status(201).json({
      message: "User created successfully",
      user: {
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        dpi: newUser.dpi,
        address: newUser.address,
        phone: newUser.phone,
        nombreTrabajo: newUser.nombreTrabajo,
        ingresosMensuales: newUser.ingresosMensuales,
        nameAccount: newUser.nameAccount,
        profilePicture: newUser.profilePicture
      }
    });
  } catch (err) {
    console.error("Error registering user:", err);
    return res.status(500).json({
      message: "User registration failed",
      error: err.message
    });
  }
};