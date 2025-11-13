import service from "@/commons/utils/request";

const prefix = "categories";


export function listCategory() {
  return service
    .get(`/${prefix}`)
    .then((res) => res)
    .catch((err) => {
      console.error("Lỗi lấy danh sách categories:", err);
      throw err;
    });
}

export function addCategory(data) {
  return service
    .post(`/${prefix}`, data)
    .then((res) => res)
    .catch((err) => {
      console.error("Lỗi tạo mới category:", err);
      throw err;
    });
}

export function updateCategory(key, data) {
  return service
    .put(`/${prefix}/${key}`, data)
    .then((res) => res)
    .catch((err) => {
      console.error("Lỗi cập nhật category:", err);
      throw err;
    });
}

export function deleteCategory(key) {
  return service
    .delete(`/${prefix}/${key}`)
    .then((res) => res)
    .catch((err) => {
      console.error("Lỗi xóa category:", err);
      throw err;
    });
}