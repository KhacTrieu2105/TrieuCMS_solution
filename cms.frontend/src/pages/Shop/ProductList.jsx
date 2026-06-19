import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';

const API_URL = "https://localhost:7186";

const ProductList = ({ categoryId }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hàm thông báo tính năng đang phát triển
    const handleFeatureDevelopment = () => {
        alert("Tính năng mua hàng đang được cập nhật. Vui lòng quay lại sau!");
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let data;
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
    }, [categoryId]);

    if (loading) return <div className="text-center py-5">Đang tải sản phẩm...</div>;

    return (
        <div className="row row-cols-1 row-cols-md-3 g-4">
            {products.length > 0 ? (
                products.map(product => (
                    <div key={product.id} className="col">
                        <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                            <img
                                src={`${API_URL}${product.imageUrl}`}
                                className="card-img-top"
                                alt={product.name}
                                style={{ height: "200px", objectFit: "cover" }}
                            />
                            <div className="card-body">
                                <h6 className="fw-bold text-truncate">{product.name}</h6>
                                <p className="text-danger fw-bold">{product.price?.toLocaleString('vi-VN')} ₫</p>
                                <div className="d-flex gap-2">
                                    <Link to={`/Product/Details/${product.id}`} className="btn btn-sm btn-outline-primary flex-grow-1">
                                        Chi tiết
                                    </Link>
                                    {/* Nút Mua ngay được gán hàm thông báo */}
                                    <button
                                        className="btn btn-sm btn-primary flex-grow-1"
                                        onClick={handleFeatureDevelopment}
                                    >
                                        Mua ngay
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-12 text-center py-5">
                    <p className="text-muted">Không có sản phẩm nào trong danh mục này.</p>
                </div>
            )}
        </div>
    );
};

export default ProductList;