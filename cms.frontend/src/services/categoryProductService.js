import axiosClient from '../api/axiosClient';

const categoryProductService = {
    /**
     * Hàm lấy toàn bộ danh mục sản phẩm từ Backend
     */
    getAllCategoryProducts: () => {
        const url = '/categoriesProducts';
        return axiosClient.get(url);
    }
};

export default categoryProductService;