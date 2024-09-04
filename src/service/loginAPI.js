// src/service/loginAPI.js
import axios from "axios";

const getUserInfo = (userId, userPw) => {
  const reqData = {
    user_id: userId,
    user_pw: userPw,
  };

  //let serverUrl = "//localhost:8081";
  let serverUrl =
    "//ec2-43-201-145-111.ap-northeast-2.compute.amazonaws.com:8081"; // 배포용 서버 Url

  return axios.post(serverUrl + "/user/login", reqData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default {
  async doLogin(userId, userPw) {
    try {
      const getUserInfoPromise = getUserInfo(userId, userPw);
      const [userInfoResponse] = await Promise.all([getUserInfoPromise]);
      if (userInfoResponse.data.length === 0) {
        return "notFound";
      } else {
        localStorage.setItem("user_token", userInfoResponse.data.user_token);
        localStorage.setItem("user_role", userInfoResponse.data.user_role);
        return userInfoResponse;
      }
    } catch (err) {
      console.error(err);
    }
  },
};
