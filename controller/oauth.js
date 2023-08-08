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
    const baseUrl = "http://localhost:8081/api/v1/users/login";
    const body = {
        client_id: process.env.GITHUB_CLIENT,
        client_secret: process.env.GITHUB_SECRET,
        code,
    }

    try {
        const { data: request } = await axios.post(baseUrl, body, {
          headers: { Accept: "application/json" },
        });

        console.log("log : request : " + request);

        return res.status(201).redirect("/");
    } catch (err) {
        console.error(err);
        return res.redirect(
            500,
            "/?loginError=server error occured. please try again.",
        );
    }
};