/**
 * Hàm gọi API từ web server.
 * @param {string} url Đường dẫn API
 * @param {object} options Các cấu hình thêm (method, headers, body...)
 */

// chạy ở codesanbox
const BACKEND_URL_CodeSanBox = "https://s5wc99-8080.csb.app";
// chạy ở local
// const BACKEND_URL = "http://localhost:8080";

async function fetchModel(url, options = {}) {
  try {
    // Cấu hình mặc định để luôn đính kèm Cookie chứa Session
    const fetchOptions = {
      credentials: "include", // <-- ĐÂY LÀ CHÌA KHÓA CHO TÍNH NĂNG LOGIN
      ...options, // Gộp các tùy chọn khác (như POST, body) nếu có
    };

    const response = await fetch(
      `${BACKEND_URL_CodeSanBox}${url}`,
      fetchOptions
    );

    if (!response.ok) {
      // Nếu là lỗi 401 hoặc 400, lấy luôn text lỗi từ Backend để hiển thị (Rất hữu ích cho Login)
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! Status: ${response.status}`);
    }

    // Nếu API trả về JSON thì parse, nếu là text (như lúc Logout) thì trả về text
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const result = await response.json();
      return { data: result };
    } else {
      const textResult = await response.text();
      return { data: textResult };
    }
  } catch (error) {
    console.error("Lỗi khi fetch dữ liệu từ Backend:", error.message);
    throw error;
  }
}
export default fetchModel;
