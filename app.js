import dotenv from "dotenv/config.js";
import express from 'express';
import oauthRouter from "./oauth.js"
import axios from "axios";

const app = express();

app.set("PORT", 3000);

app.use("/oauth", oauthRouter);

app.listen(app.get("PORT"), () => {
    console.log(`✅ Server is running on ${app.get("PORT")}`);

    axios.get("http://127.0.0.1:3000/oauth/kakao");
});

