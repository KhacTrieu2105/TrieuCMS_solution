import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import { Link } from 'react-router-dom';

const HotProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = "https://localhost:7186";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await productService.getHotProducts();
                setProducts(data);
            } catch (err) {
                console.error("Lỗi tải sản phẩm hot:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="text-center py-5">Đang tải sản phẩm hot...</div>;

    // Sửa đoạn này trong file HotProducts.jsx:
    return (
        <section className="py-5 bg-white">
            <div className="container">
                <h3 className="mb-4 text-center">🔥 Sản phẩm bán chạy</h3>
                <div className="row">
                    {/* THÊM ĐIỀU KIỆN KIỂM TRA TẠI ĐÂY */}
                    {Array.isArray(products) && products.length > 0 ? (
                        products.map(product => (
                            <div key={product.id} className="col-md-4 mb-4">
                                <div className="card h-100 border-0 shadow-sm transition-card">
                                    <img
                                        src={`${API_URL}${product.imageUrl}`}
                                        alt={product.name}
                                        className="card-img-top"
                                    />
                                    <div className="card-body text-center">
                                        <h5 className="card-title">{product.name}</h5>
                                        <p className="text-primary fw-bold">
                                            {product.price ? product.price.toLocaleString() : '0'}đ
                                        </p>
                                        <Link to={`/Product/Details/${product.id}`} className="btn btn-outline-primary">Xem chi tiết</Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center">Không có sản phẩm bán chạy nào.</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default HotProducts;