import { Router } from "express";
import { convertData } from "./converter.controller.js";

const router = Router();

router.post("/convertDivisa", convertData);

export default router;