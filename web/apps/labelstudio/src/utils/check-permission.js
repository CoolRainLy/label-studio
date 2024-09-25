import {useAPI} from "../providers/ApiProvider"

const currentUserInfo = {
  isSet: false,
  isStaff: false
}


export const checkPermission = () => {
  return currentUserInfo.isStaff
}


export const getCurrentUserInfo = async () => {
  await fetch("/api/current-user/whoami")
  .then(response => response.json()) // 解析响应并返回 JSON 数据
  .then(data => {
    currentUserInfo.isStaff = data.is_staff
    currentUserInfo.isSet = true
  })
  .catch(error => {
    console.error("Error fetching user info:", error);
  });
}
