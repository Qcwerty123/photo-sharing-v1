/**
 * Hàm gọi API từ web server.
 * @param {string} url
 */
async function fetchModel(url) {
  try {
    // chạy ở codesanbox
    const BACKEND_URL_CodeSanBox = "https://5tk53p-8080.csb.app";
    // chạy ở local
    const BACKEND_URL = "http://localhost:8080";

    const response = await fetch(`${BACKEND_URL_CodeSanBox}${url}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return { data: result };
  } catch (error) {
    console.error("Lỗi khi fetch dữ liệu từ Backend:", error);
    throw error;
  }
}

export default fetchModel;
