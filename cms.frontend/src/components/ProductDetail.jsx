import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../services/productService';

const API_URL = "https://localhost:7186";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error("Lỗi khi tải chi tiết sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="text-center mt-5"><h3>Đang tải...</h3></div>;
    if (!product) return <div className="text-center mt-5"><h3>Không tìm thấy sản phẩm.</h3></div>;

    return (
        <div className="container my-5">
            <div className="row shadow-sm p-4 bg-white rounded">
                {/* Hình ảnh */}
                <div className="col-md-5">
                    <img
                        src={`${API_URL}${product.imageUrl}`}
                        alt={product.name}
                        className="img-fluid rounded border"
                    />
                </div>

                {/* Thông tin */}
                <div className="col-md-7">
                    <h2 className="fw-bold text-primary mb-3">{product.name}</h2>
                    <h3 className="text-danger fw-bold mb-4">
                        {product.price?.toLocaleString('vi-VN')} ₫
                    </h3>

                    <p className="text-muted mb-4" style={{ minHeight: '100px' }}>
                        {product.description || "Sản phẩm không có mô tả bổ sung."}
                    </p>

                    <div className="d-flex gap-3">
                        <button className="btn btn-primary btn-lg px-4">Mua ngay</button>
                        <Link to="/" className="btn btn-outline-secondary btn-lg px-4">
                            Quay lại
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;