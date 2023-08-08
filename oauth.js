import express from 'express';
import { githubLoginPage, githubLoginWithServer } from './controller/oauth.js';

const oauthRouter = express.Router();

oauthRouter.get("/github", githubLoginPage);
oauthRouter.get("/github/callback", githubLoginWithServer);

export default oauthRouter;