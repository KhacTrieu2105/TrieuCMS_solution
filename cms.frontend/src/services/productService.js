import axios from 'axios'; // Đảm bảo bạn đã import axios hoặc axiosClient
import axiosClient from '../api/axiosClient';

const API_URL = "https://localhost:7186";

const productService = {
    // 1. Lấy tất cả sản phẩm
    getAllProducts: () => {
        return axiosClient.get('/Products');
    },

    getProductsByCategory: async (categoryId) => {
        // Sửa 'product' thành 'Products' (thêm chữ 's')
        // Sửa 'GetByCategory' thành 'categoryproduct' để khớp với Route bạn đã định nghĩa
        const response = await axios.get(`https://localhost:7186/api/Products/categoryproduct/${categoryId}`);
        return response.data;
    },
    // 3. Lấy sản phẩm chi tiết theo ID
    getProductById: (id) => {
        return axiosClient.get(`/Products/${id}`);
    }
};

export default productService;