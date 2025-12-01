import service from "@/commons/utils/request";

/**
 * @typedef {Object} ListCategoryResponse
 * @property {Array} data - Danh sách category
 * @property {number} total - Tổng số category
 */

const prefix = "categories";


/**
 * Lấy danh sách category có phân trang
 * @param {Object} params
 * @returns {Promise<ListCategoryResponse>}
 */
export function listCategory(params = {}) {
  return service
    .get(`/${prefix}`, { params })
    .then((res) => res)
    .catch(() => {
      console.error("Lỗi lấy danh sách categories:");
      throw err;
    });
}

export function getCategoryByKey(key) {
  return service
    .get(`/${prefix}/${key}`) 
    .then((res) => res)
    .catch((err) => {
      console.error("Lỗi lấy chi tiết category:", err);
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