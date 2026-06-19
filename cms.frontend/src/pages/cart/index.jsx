import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartTable from './CartTable';

export const CART_STORAGE_KEY = 'trieucms_cart';
const FREE_SHIP_THRESHOLD = 500000;
const SHIPPING_FEE = 30000;

const loadCart = () => {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

// Trang quản lý giỏ hàng — thay cho Cart.jsx cũ
const CartPage = () => {
    const [items, setItems] = useState(loadCart);
    const navigate = useNavigate();

    // Đồng bộ giỏ hàng vào localStorage mỗi khi thay đổi
    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const increase = (id) => {
        setItems((prev) =>
            prev.map((it) => (it.id === id ? { ...it, quantity: it.quantity + 1 } : it))
        );
    };

    const decrease = (id) => {
        setItems((prev) =>
            prev.map((it) =>
                it.id === id && it.quantity > 1 ? { ...it, quantity: it.quantity - 1 } : it
            )
        );
    };

    const remove = (id) => {
        setItems((prev) => prev.filter((it) => it.id !== id));
    };

    const subtotal = useMemo(
        () => items.reduce((sum, it) => sum + it.price * it.quantity, 0),
        [items]
    );
    const shippingFee = items.length === 0 ? 0 : subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = subtotal + shippingFee;

    return (
        <div className="container cart-page">
            <h4 className="cart-page-title">Giỏ hàng của bạn</h4>

            <div className="cart-layout">
                <div className="cart-main">
                    <CartTable
                        items={items}
                        onIncrease={increase}
                        onDecrease={decrease}
                        onRemove={remove}
                    />

                    {items.length > 0 && (
                        <Link to="/" className="cart-continue">
                            <i className="bi bi-arrow-left"></i> Tiếp tục mua hàng
                        </Link>
                    )}
                </div>

                <aside className="cart-summary">
                    <h6>Tóm tắt đơn hàng</h6>

                    <div className="cart-summary-row">
                        <span>Tạm tính</span>
                        <span className="cart-mono">{subtotal.toLocaleString('vi-VN')} ₫</span>
                    </div>
                    <div className="cart-summary-row">
                        <span>Phí vận chuyển</span>
                        <span className="cart-mono">
                            {shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')} ₫`}
                        </span>
                    </div>
                    <hr />
                    <div className="cart-summary-row cart-summary-total">
                        <span>Tổng cộng</span>
                        <span className="cart-mono">{total.toLocaleString('vi-VN')} ₫</span>
                    </div>

                    <button
                        type="button"
                        className="cart-checkout-btn"
                        disabled={items.length === 0}
                        onClick={() => navigate('/checkout')}
                    >
                        Tiến hành thanh toán <i className="bi bi-arrow-right"></i>
                    </button>
                </aside>
            </div>
        </div>
    );
};

export default CartPage;