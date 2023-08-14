import axios from "axios";
import crawlKakaoLoginPage from "../util/crawlKakaoLoginPage.js";
import {sendMe, sendFriendsMessage } from "../util/sendMessage.js";

export const kakaoLoginPage = (req, res) => {
  console.log("[INFO] : start LoginPage");
  const baseUrl = "https://kauth.kakao.com/oauth/authorize";
  const config = {
    client_id: process.env.KAKAO_CLIENT,
    redirect_uri: process.env.KAKAO_REDIRECT_URL,
    response_type: "code",
    scope: "friends,talk_message",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  console.log("[INFO] : finalUrl : " + finalUrl);
  console.log("[INFO] : end githubLoginPage");

  crawlKakaoLoginPage(finalUrl);
};

export const kakaoLoginWithServer = async (req, res) => {
  console.log("[INFO] : start LoginWithServer");
  const { code } = req.query;
  const baseUrl = "https://kauth.kakao.com/oauth/token";
  const body = {
    grant_type: "authorization_code",
    client_id: process.env.KAKAO_CLIENT,
    redirect_uri: process.env.KAKAO_REDIRECT_URL,
    code,
  };

  try {
    const { data: request } = await axios.post(baseUrl, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
    const access_token = request.access_token;
    console.log("[INFO] : access_token : " + access_token);

    sendMe(access_token);
    sendFriendsMessage(access_token);

    return res.status(201).redirect("/");
  } catch (err) {
    console.error(err);
    return res.redirect(
      500,
      "/?loginError=server error occured. please try again."
    );
  }
};
