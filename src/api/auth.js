import service from "@/commons/utils/request";

const AUTH_API = "/auth";
export function login(user_name, password) {
  return service
    .post(
      `${AUTH_API}/login`,
      { user_name, password },
      { withCredentials: true }
    )
    .then((res) => {
      console.log("Đăng nhập thành công:", res);
      return res;
    })
    .catch((err) => {
      console.error("Đăng nhập thất bại:", err);
    });
}

export function logout() {
  return service
    .post(`${AUTH_API}/logout`, {}, { withCredentials: true })
    .then((res) => {
      console.log("Đăng xuất thành công:", res);
      return res;
    })
    .catch((err) => {
      console.error("Đăng xuất thất bại:", err);
    });
}

export function check() {
  return service
    .get(`${AUTH_API}/check`, { withCredentials: true })
    .then((res) => {
      if (res.data && res.data.authenticated) {
        console.log("User is authenticated:", res.data.user);
        return { authenticated: true, user: res.data.user };
      } else {
        console.warn("User is not authenticated.");
        return { authenticated: false };
      }
    })
    .catch((err) => {
      console.error("Failed to validate session:", err);
      return { authenticated: false, error: err };
    });
}
