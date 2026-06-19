import React from 'react';
import { Link } from 'react-router-dom';

const API_URL = "https://localhost:7186";

const ProductCard = ({ product }) => {
    const {
        id,
        name,
        imageUrl,
        price,
        oldPrice,
        rating,
        categoryType = 'default',
        tag,
    } = product;

    // Hàm thông báo tính năng đang phát triển
    const handleFeatureDevelopment = (e) => {
        e.preventDefault();
        alert("Tính năng Mua ngay đang được phát triển. Vui lòng quay lại sau!");
    };

    const discount = oldPrice && oldPrice > price
        ? Math.round(((oldPrice - price) / oldPrice) * 100)
        : null;

    const ribbonLabel = categoryType === 'tech'
        ? 'Công nghệ'
        : categoryType === 'dairy'
            ? 'Dinh dưỡng'
            : 'Sản phẩm';

    return (
        <div className="product-card">
            <div className="product-card-media">
                <span className={`category-ribbon ribbon-${categoryType}`}>{ribbonLabel}</span>
                {tag && <span className="product-tag">{tag}</span>}
                {discount && <span className="discount-tag">-{discount}%</span>}
                <img
                    src={`${API_URL}${imageUrl}`}
                    alt={name}
                    loading="lazy"
                />
            </div>

            <div className="product-card-body">
                <h6 className="product-name" title={name}>{name}</h6>

                {rating != null && (
                    <div className="product-rating" aria-label={`Đánh giá ${rating} trên 5`}>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <i key={i} className={`bi ${i < Math.round(rating) ? 'bi-star-fill' : 'bi-star'}`}></i>
                        ))}
                    </div>
                )}

                <div className="product-price-row">
                    <span className="price-current">{price.toLocaleString('vi-VN')} ₫</span>
                    {oldPrice && oldPrice > price && (
                        <span className="price-old">{oldPrice.toLocaleString('vi-VN')} ₫</span>
                    )}
                </div>

                <div className="product-actions">
                    <Link to={`/Product/Details/${id}`} className="btn-detail">
                        Chi tiết
                    </Link>
                    {/* Đã thêm onClick tại đây */}
                    <button className="btn-buy" type="button" onClick={handleFeatureDevelopment}>
                        <i className="bi bi-cart-plus me-1"></i>Mua ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;