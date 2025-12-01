import service from "@/commons/utils/request";

const prefix = "zalo-users";

/**
 * @typedef {Object} ListZaloUserResponse
 * @property {Array} data - Danh sách zalo user
 * @property {number} total - Tổng số zalo user
 */

/**
 * Lấy danh sách zalo user có phân trang
 * @param {Object} params
 * @returns {Promise<ListZaloUserResponse>}
 */

export function listZaloUsers(params = {}) {
  return service
    .get(`/${prefix}`, { params })
    .then((res) => res)
    .catch((err) => {
      console.error("Lỗi lấy danh sách zalo users:", err);
      throw err;
    });
}

export function deleteZaloUser(id) {
  return service
    .delete(`/${prefix}/${id}`)
    .then((res) => res)
    .catch((err) => {
      console.error("Lỗi xóa zalo user:", err);
      throw err;
    });
}
