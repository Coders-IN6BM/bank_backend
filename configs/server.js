"use strict";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { dbConnection } from "./mongo.js";
import authRoutes from "../src/auth/auth.routes.js";
import apiLimiter from "../src/middleware/rate-limit-validator.js";
import { crearAdmin } from "./createAdminDefaul.js"; // Importar la función para crear el admin

const app = express();

const middlewares = (app) => {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(apiLimiter);
};

const routes = (app) => {
  app.use("/bank/v1/auth", authRoutes);
};

const conectarDB = async () => {
  try {
    await dbConnection();
  } catch (err) {
    console.log(`Database connection failed: ${err}`);
    process.exit(1);
  }
};

export const initiServer = async () => {
  try {
    middlewares(app);
    await conectarDB();
    routes(app);
    await crearAdmin(); // Crear el administrador por defecto

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.log(`Server init failed: ${err}`);
  }
};