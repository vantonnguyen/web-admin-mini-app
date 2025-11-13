import service from "@/commons/utils/request";

const prefix = "categories";


export function getCategories() {
  return service
    .get(`/${prefix}`)
    .then((res) => res)
    .catch((err) => {
      console.error("Lỗi lấy danh sách categories:", err);
      throw err;
    });
}
