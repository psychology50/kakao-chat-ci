import dotenv from "dotenv/config.js";
import express from 'express';
import oauthRouter from "./oauth.js"

const app = express();

app.set("PORT", 3000);

app.use("/oauth", oauthRouter);

app.listen(app.get("PORT"), () => {
    console.log(`✅ Server is running on ${app.get("PORT")}`);
});