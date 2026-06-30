import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = "https://localhost:7186";



const ribbonLabel = (categoryType) => {
    if (categoryType === 'tech') return 'Công nghệ';
    if (categoryType === 'dairy') return 'Dinh dưỡng';
    return null;
};

// Hàm xử lý thêm vào giỏ hàng
const addToCart = (product, quantity) => {
    const customer = JSON.parse(localStorage.getItem('customer'));
    const customerId = customer ? customer.id : 'guest';
    const CART_STORAGE_KEY = `trieucms_cart_${customerId}`;

    let cart = [];
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        cart = raw ? JSON.parse(raw) : [];
    } catch {
        cart = [];
    }

    const existing = cart.find((it) => it.id === product.id);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            imageUrl: product.imageUrl,
            price: product.price,
            categoryType: product.categoryType,
            quantity,
        });
    }
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
};

const ProductInfo = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const [justAdded, setJustAdded] = useState(false);
    const navigate = useNavigate();

    if (!product) return null;

    const {
        name,
        imageUrl,
        price,
        oldPrice,
        description,
        rating,
        categoryType,
        sku,
        stockQuantity
    } = product;
    const discount = oldPrice && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : null;
    const label = ribbonLabel(categoryType);
    const handleAddToCart = () => {

        if (quantity > stockQuantity) {
            alert("Số lượng sản phẩm trong kho không đủ!");
            return;
        }

        addToCart(product, quantity);

        setJustAdded(true);

        setTimeout(() => {
            setJustAdded(false);
        }, 2000);

    };

    const handleBuyNow = () => {

        if (quantity > stockQuantity) {
            alert("Số lượng sản phẩm trong kho không đủ!");
            return;
        }

        addToCart(product, quantity);

        navigate("/checkout");

    };
    return (
        <div className="product-info">
            {/* Media Section: Khớp với .product-info-media trong CSS */}
            <div className="product-info-media">
                {label && <span className={`category-ribbon ribbon-${categoryType}`}>{label}</span>}
                {discount && <span className="discount-tag">-{discount}%</span>}
                <img src={`${API_URL}${imageUrl}`} alt={name} />
            </div>

            {/* Body Section: Khớp với .product-info-body trong CSS */}
            <div className="product-info-body">
                {sku && <span className="product-sku cart-mono">SKU: {sku}</span>}
                <h1 className="product-info-name">{name}</h1>

                {rating != null && (
                    <div className="product-rating product-info-rating">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <i key={i} className={`bi ${i < Math.round(rating) ? 'bi-star-fill' : 'bi-star'}`}></i>
                        ))}
                        <span className="rating-value">{rating.toFixed(1)}</span>
                    </div>
                )}

                <div className="product-info-price">
                    <p className="text-success fw-semibold mt-2">
                        Còn lại: {stockQuantity} sản phẩm
                    </p>
                    <span className="price-current">{price?.toLocaleString('vi-VN')} ₫</span>
                    {oldPrice && oldPrice > price && (
                        <span className="price-old">{oldPrice.toLocaleString('vi-VN')} ₫</span>
                    )}
                </div>

                <div
                    className="product-info-desc"
                    dangerouslySetInnerHTML={{ __html: description || 'Sản phẩm chưa có mô tả.' }}
                />

                {/* Actions: Đảm bảo class khớp để nhận flex/grid layout */}
                <div className="product-info-actions">

                    <div className="qty-stepper qty-stepper-lg">

                        <button
                            type="button"
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            aria-label="Giảm số lượng"
                        >
                            <i className="bi bi-dash"></i>
                        </button>

                        <span>{quantity}</span>

                        <button
                            type="button"
                            onClick={() => {
                                if (quantity >= stockQuantity) {
                                    alert("Số lượng sản phẩm trong kho không đủ!");
                                    return;
                                }

                                setQuantity(quantity + 1);
                            }}
                            aria-label="Tăng số lượng"
                        >
                            <i className="bi bi-plus"></i>
                        </button>

                    </div>

                    <button
                        type="button"
                        className="btn-add-cart"
                        onClick={handleAddToCart}
                        disabled={stockQuantity <= 0}
                    >
                        <i className="bi bi-cart-plus me-2"></i>

                        {stockQuantity <= 0
                            ? "Hết hàng"
                            : justAdded
                                ? "Đã thêm vào giỏ"
                                : "Thêm vào giỏ hàng"}
                    </button>

                    <button
                        type="button"
                        className="btn-buy-now"
                        onClick={handleBuyNow}
                        disabled={stockQuantity <= 0}
                    >
                        {stockQuantity <= 0 ? "Hết hàng" : "Mua ngay"}
                    </button>

                </div>
            </div>
        </div>
    );
};

export default ProductInfo;