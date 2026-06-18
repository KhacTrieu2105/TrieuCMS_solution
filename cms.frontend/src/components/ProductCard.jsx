import React from 'react';
import { Link } from 'react-router-dom';

const API_URL = "https://localhost:7186";

const ProductCard = ({ product }) => {
    return (
        <div className="card h-100 shadow-sm border-0 transition-card">
            <img
                src={`${API_URL}${product.imageUrl}`}
                className="card-img-top"
                alt={product.name}
                style={{ height: "200px", objectFit: "cover" }}
            />
            <div className="card-body">
                <h6 className="card-title fw-bold text-truncate">{product.name}</h6>
                <p className="text-primary fw-bold mb-2">
                    {product.price.toLocaleString('vi-VN')} ₫
                </p>
                <div className="d-flex gap-2">
                    <Link to={`/Product/Details/${product.id}`} className="btn btn-outline-primary btn-sm flex-grow-1">
                        Chi tiết
                    </Link>
                    <button className="btn btn-primary btn-sm flex-grow-1">Mua ngay</button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;