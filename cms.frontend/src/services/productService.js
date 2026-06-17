import axiosClient from '../api/axiosClient';

const productService = {
    // Sửa lại đúng đường dẫn: /Products
    getAllProducts: () => {
        return axiosClient.get('/Products');
    },

    // Sửa lại đúng đường dẫn: /Products/categoryproduct/{id}
    //getByCategory: (categoryId) => {
    //    return axiosClient.get(`/Products/categoryproduct/${categoryId}`);
    //}
    getProductById: (id) => {
        // Hãy kiểm tra xem API của bạn thực tế là /Products/${id} hay /api/Products/${id}
        return axiosClient.get(`/Products/${id}`);
    }

};

export default productService;