import axios from "axios";

export const githubLoginPage = (req, res) => {
  console.log("log : start githubLoginPage");
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GITHUB_CLIENT,
    scope: "read:user user:email",
    allow_signup: true,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  console.log("log : finalUrl : " + finalUrl);
  console.log("log : end githubLoginPage");

  return res.redirect(finalUrl); 
};

export const githubLoginWithServer = async (req, res) => {
    console.log("log : start githubLoginWithServer");
    const { code } = req.query;
    const baseUrl = "https://github.com/login/oauth/access_token";
    const body = {
        client_id: process.env.GITHUB_CLIENT,
        client_secret: process.env.GITHUB_SECRET,
        code,
    }
    const finalUrl = baseUrl;

    try {
        const { data: requestToken } = await axios.post(finalUrl, body, {
          headers: { Accept: "application/json" },
        });
        const { access_token } = requestToken;
        console.log("log : access_token : " + access_token);
    
        const apiUrl = "https://api.github.com";
        const { data: userdata } = await axios.get(`${apiUrl}/user`, {
          headers: { Authorization: `token ${access_token}` },
        }); 
    
        const { data: emailDataArr } = await axios.get(`${apiUrl}/user/emails`, {
          headers: { Authorization: `token ${access_token}` },
        });
    
        const { email } = emailDataArr.find(
          (emailObj) => emailObj.primary === true && emailObj.verified === true,
        );
    
        const { login: nickname, id, avatar_url: avatarUrl } = userdata;

        console.log("log : nickname : " + nickname);
        console.log("log : id : " + id);
        console.log("log : avatarUrl : " + avatarUrl);
        console.log("log : email : " + email);

        return res.status(201).redirect("/");
    } catch (err) {
        console.error(err);
        return res.redirect(
            500,
            "/?loginError=server error occured. please try again.",
        );
    }
};