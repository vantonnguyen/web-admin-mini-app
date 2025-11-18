import service from "@/commons/utils/request";

/**
 * @typedef {Object} ListVocabularyResponse
 * @property {Array} data - Danh sách vocabulary
 * @property {number} total - Tổng số vocabulary
 */

const prefix = "vocabularies";


/**
 * Lấy danh sách vocabulary có phân trang
 * @param {Object} params
 * @returns {Promise<ListVocabularyResponse>}
 */
export function listVocabulary(params = {}) {
  return service
    .get(`/${prefix}`, { params })
    .then((res) => res)
    .catch(() => {
      console.error("Lỗi lấy danh sách vocabularies:");
      throw err;
    });
}

export function addVocabulary(data) {
  return service
    .post(`/${prefix}`, data)
    .then((res) => res)
    .catch((err) => {
      console.error("Lỗi tạo mới vocabulary:", err);
      throw err;
    });
}

export function updateVocabulary(key, data) {
  return service
    .put(`/${prefix}/${key}`, data)
    .then((res) => res)
    .catch((err) => {
      console.error("Lỗi cập nhật vocabulary:", err);
      throw err;
    });
}


export function deleteVocabulary(key) {
  return service
    .delete(`/${prefix}/${key}`)
    .then((res) => res)
    .catch((err) => {
      console.error("Lỗi xóa vocabulary:", err);
      throw err;
    });
}
