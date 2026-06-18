import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';

const API_URL = "https://localhost:7186";

const ProductList = ({ categoryId }) => { // 1. Nhận categoryId từ App.js
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let data;
                // 2. Kiểm tra nếu có categoryId thì gọi API theo danh mục, ngược lại gọi tất cả
                if (categoryId) {
                    data = await productService.getProductsByCategory(categoryId);
                } else {
                    data = await productService.getAllProducts();
                }
                setProducts(data || []);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [categoryId]); // 3. Chạy lại useEffect mỗi khi categoryId thay đổi

    if (loading) {
        return <div className="text-center my-4">Đang tải sản phẩm...</div>;
    }

    return (
        <div className="row row-cols-1 row-cols-md-4 g-3">
            {products.length > 0 ? (
                products.map(product => (
                    <div key={product.id} className="col">
                        <div className="card h-100 shadow-sm border-0 transition-card">
                            <img
                                src={`${API_URL}${product.imageUrl}`}
                                className="card-img-top p-2"
                                alt={product.name}
                                style={{ height: "180px", objectFit: "contain" }}
                            />
                            <div className="card-body d-flex flex-column">
                                <h6 className="card-title" style={{ fontSize: '0.9rem', height: '40px' }}>
                                    {product.name}
                                </h6>
                                <p className="text-danger fw-bold mb-2">
                                    {product.price?.toLocaleString('vi-VN')} ₫
                                </p>
                                <div className="d-flex gap-1 mt-auto">
                                    <Link
                                        to={`/Product/Details/${product.id}`}
                                        className="btn btn-sm btn-outline-primary w-50"
                                    >
                                        Chi tiết
                                    </Link>
                                    <button className="btn btn-sm btn-primary w-50">Mua ngay</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-12 text-center my-4">
                    <p>Không có sản phẩm nào trong danh mục này.</p>
                </div>
            )}
        </div>
    );
};

export default ProductList;