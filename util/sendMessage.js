import axios from "axios";

const getFriends = async (access_token) => {
  console.log("[INFO] : getFriend");

  const baseUrl = "https://kapi.kakao.com/v1/api/talk/friends";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    Authorization: `Bearer ${access_token}`,
  };
  let friends = [];

  try {
    const { data: request } = await axios.get(baseUrl, { headers });
    console.log("[INFO] : request.elements : " + request.elements);

    for (const friend of request.elements) {
      console.log("[INFO] : friend.uuid : " + friend.uuid);
      friends.push(friend.uuid);
    }

    return friends;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const sendMe = (access_token) => {
  console.log("[INFO] : sendMessage");
  const baseUrl = "https://kapi.kakao.com/v2/api/talk/memo/send";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Bearer ${access_token}`,
  };

  // 템플릿 메시지, args를 string으로 변환해야 함
  const body = {
    template_id: process.env.KAKAO_TEMPLATE_ID,
    template_args: JSON.stringify({
      title: "hello world",
      desc: "내용"
    }),
  };
  
  axios
    .post(baseUrl, body, { headers })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

const sendFriendsMessage = async (access_token) => {
  const friends = await getFriends(access_token);

  const baseUrl = "https://kapi.kakao.com/v1/api/talk/friends/message/send";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Bearer ${access_token}`,
  };
  const body = {
    receiver_uuids: JSON.stringify(friends),
    template_id: process.env.KAKAO_SENDER_TEMPLATE_ID,
    template_args: JSON.stringify({
      title: "돼냐?",
      desc: "내용"
    }),
  };

  axios
    .post(baseUrl, body, { headers })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err.data);
    });
}

export {sendMe, sendFriendsMessage};
