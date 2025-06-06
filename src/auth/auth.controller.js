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
      console.error("Error en el login:", err); // Agrega este log para depurar
      return res.status(500).json({
          message: "Login failed due to server error",
          error: err.message || "Unknown error"
      });
  }
};