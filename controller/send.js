import sendMessage from "../util/sendMessage.js";

export const sendPage = async (req, res) => {
  console.log("[INFO] : start sendPage");
  const access_token = req.query.access_token;
  if (!access_token) {
    const error_message = "access_token is null";
    res.redirect("/exit/error?message=" + encodeURIComponent(error_message));
  }
  await sendMessage(access_token);
  res.redirect("/exit");
};
