import service from "@/commons/utils/request";

export function login(user_name, password) {
  return service.post(
    "/auth/login",
    { user_name, password },
    { withCredentials: true }
  )
    .then(res => {
      console.log("Đăng nhập thành công:", res);
      return res;
    })
    .catch(err => {
      console.error("Đăng nhập thất bại:", err);
    });
}


