import express from "express";
import axios from "axios";
import dotenv from "dotenv/config.js";
import oauthRouter from "./router/oauth.js";
import sendRouter from "./router/send.js";
import exitRouter from "./router/exit.js";

const core = require("@actions/core");
const github = require("@actions/github");

const app = express();

app.set("PORT", 3000);

app.use("/oauth", oauthRouter);
app.use("/send", sendRouter);
app.use("/exit", exitRouter);

app.listen(app.get("PORT"), () => {
  console.log(`✅ Server is running on ${app.get("PORT")}`);

  axios.get("http://127.0.0.1:3000/oauth/kakao");
});
