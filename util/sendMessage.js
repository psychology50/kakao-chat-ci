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

const sendFriendsMessage = async (access_token) => {
  try {
    const friends = await getFriends(access_token);

    if (friends.length > 0) {
      console.log("[INFO] : sendFriendsMessage");
      const baseUrl = "https://kapi.kakao.com/v1/api/talk/friends/message/send";
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${access_token}`,
      };
      const body = {
        receiver_uuids: JSON.stringify(friends),
        template_id: process.env.KAKAO_SENDER_TEMPLATE_ID,
        template_args: JSON.stringify({
          title: process.argv[2] || "(default) commit trigger",
          desc: process.argv[3] || "(default) repository에 event가 발생했습니다.",
        }),
      };

      const { data: response } = await axios.post(baseUrl, body, { headers });
      console.log("[INFO] : response : " + response);
    } else {
      console.log("[INFO] : 친구가 없습니다.");
    }
  } catch (error) {
    console.log("[ERROR] sendFriendsMessage : " + error);
  }
};

const sendMe = async (access_token) => {
  try {
    console.log("[INFO] : sendMe");
    const baseUrl = "https://kapi.kakao.com/v2/api/talk/memo/send";
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${access_token}`,
    };

    // 템플릿 메시지, args를 string으로 변환해야 함
    const body = {
      template_id: process.env.KAKAO_TEMPLATE_ID,
      template_args: JSON.stringify({
        title: process.argv[2] || "(default) commit trigger",
        desc: process.argv[3] || "(default) repository에 event가 발생했습니다.",
      }),
    };

    const { data: response } = await axios.post(baseUrl, body, { headers });
    console.log("[INFO] : response : " + response);
  } catch (error) {
    console.log("[ERROR] : sendMe : " + error);
  }
};

const sendMessage = async (access_token) => {
  console.log("[INFO] : sendMessage");
  try {
    sendMe(access_token);
    await sendFriendsMessage(access_token);
    console.log("[INFO] : All messages sent successfully");
  } catch (error) {
    console.log("[ERROR] : sendMessage : " + error);
  }
};

export default sendMessage;
