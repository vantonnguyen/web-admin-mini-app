import service from "@/commons/utils/request";

export async function login(user_name, password) {
  try {
    const res = await service.post(
      "/auth/login",
      { user_name, password },
      { withCredentials: true } // ⚠️ BẮT BUỘC để cookie connect.sid hoạt động
    );
    console.log("Đăng nhập thành công:", res);
    return res; // { id, user_name, role, ... } utils da xu ly response
  } catch (err) {
    console.error("Đăng nhập thất bại:", err);
  }
}


