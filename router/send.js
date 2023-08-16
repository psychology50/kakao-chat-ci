import express from "express";
import { sendPage } from "../controller/send.js";

const sendRouter = express.Router();

sendRouter.get("/", sendPage);

export default sendRouter;
