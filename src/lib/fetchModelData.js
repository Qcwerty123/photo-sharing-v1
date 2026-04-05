/**
 * Hàm gọi API từ web server.
 * @param {string} url 
 */
async function fetchModel(url) {
  try {
    // Trỏ thẳng đến Backend đang chạy ở cổng 8080
    const response = await fetch(`http://localhost:8080${url}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return { data: result }; 
    
  } catch (error) {
    console.error('Lỗi khi fetch dữ liệu từ Backend:', error);
    throw error;
  }
}

export default fetchModel;