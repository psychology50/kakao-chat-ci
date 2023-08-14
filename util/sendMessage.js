import axios from "axios";

const getFriends = (access_token) => {
    console.log("[INFO] : getFriend");
  
    const baseUrl = "https://kapi.kakao.com/v1/api/talk/friends";
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      "Authorization": `Bearer ${access_token}`,
    };
  
    axios.get(baseUrl, { headers }).then((res) => {
      console.log(res.data);
    }).catch((err) => {
      console.log(err);
    });
}

const sendMessage = (access_token) => {
    console.log("[INFO] : sendMessage");
  
    const baseUrl = "https://kapi.kakao.com/v2/api/talk/memo/send";
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      "Authorization": `Bearer ${access_token}`,
    };
    const body = {
      template_id : process.env.KAKAO_TEMPLATE_ID,
      template_args : {
        "title" : "제목",
        "desc" : "설명",
      }
    };
  
    getFriends(access_token);
  
    axios.post(baseUrl, body, { headers }).then((res) => {
      console.log(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }

export default sendMessage;