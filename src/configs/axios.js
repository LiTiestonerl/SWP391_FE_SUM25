import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:8080/api/',
});
api.interceptors.request.use(
    function (config) {
      // Do something before request is sent
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  api.interceptors.response.use(
  // (1) Nếu response thành công (status 2xx), chỉ cần trả về response
  function (response) {
    return response;
  },
  // (2) Nếu response có lỗi, xử lý lỗi ở đây
  function (error) {
    // Kiểm tra xem có phải lỗi 401 (Unauthorized) không
    if (error.response && error.response.status === 401) {
      // Xóa token và thông tin người dùng khỏi localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("accountId"); // Hoặc bất kỳ key nào khác bạn dùng

      // Chuyển hướng người dùng về trang đăng nhập
      // Dùng window.location.href để đảm bảo reload lại toàn bộ ứng dụng
      // và xóa sạch state cũ.
      window.location.href = "/login"; 
      
      // Bạn cũng có thể hiển thị một thông báo
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }

    // Với các lỗi khác (400, 404, 500...), chỉ cần trả về lỗi
    // để component cụ thể có thể xử lý nếu cần.
    return Promise.reject(error);
  }
);
export default api;