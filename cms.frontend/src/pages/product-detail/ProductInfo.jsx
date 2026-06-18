import React from 'react';

const API_URL = "https://localhost:7186";

const ProductInfo = ({ product }) => {
    if (!product) return null;

    return (
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
                <p className="text-muted mb-4">{product.description || "Sản phẩm không có mô tả."}</p>
                <div className="d-flex gap-3">
                    <button className="btn btn-primary btn-lg">Mua ngay</button>
                </div>
            </div>
        </div>
    );
};

export default ProductInfo;