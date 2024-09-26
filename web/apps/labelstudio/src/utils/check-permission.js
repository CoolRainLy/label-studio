import {useAPI} from "../providers/ApiProvider"

const currentUserInfo = {
  isSet: false,
  isStaff: false,
  isSuperuser: false
}


export const checkPermission = () => {
  return currentUserInfo.isStaff
}

export const checkIsSuperuser = () => {
  return currentUserInfo.isSuperuser
}


export const getCurrentUserInfo = async () => {
  await fetch("/api/current-user/whoami")
  .then(response => response.json()) // 解析响应并返回 JSON 数据
  .then(data => {
    currentUserInfo.isStaff = data.is_staff
    currentUserInfo.isSuperuser = data.is_superuser
    currentUserInfo.isSet = true
  })
  .catch(error => {
    console.error("Error fetching user info:", error);
  });
}
