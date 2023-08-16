import express from "express";
import { kakaoLoginPage, kakaoLoginWithServer } from "../controller/oauth.js";

const oauthRouter = express.Router();

oauthRouter.get("/kakao", kakaoLoginPage);
oauthRouter.get("/kakao/callback", kakaoLoginWithServer);

export default oauthRouter;
