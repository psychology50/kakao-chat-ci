import express from "express";
import { exitProcess, exitProcessWithError } from "../controller/exit.js";

const exitRouter = express.Router();

exitRouter.get("/", exitProcess);
exitRouter.get("/error", exitProcessWithError);

export default exitRouter;
