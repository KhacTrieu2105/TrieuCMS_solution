import React from 'react';

const API_URL = "https://localhost:7186";

const formatVND = (n) => `${n.toLocaleString('vi-VN')} ₫`;

const ribbonLabel = (categoryType) => {
    if (categoryType === 'tech') return 'Công nghệ';
    if (categoryType === 'dairy') return 'Dinh dưỡng';
    return null;
};

// Bảng danh sách sản phẩm trong giỏ — nút tăng/giảm số lượng, nút xoá
const CartTable = ({ items, onIncrease, onDecrease, onRemove }) => {
    if (!items || items.length === 0) {
        return (
            <div className="cart-empty">
                <i className="bi bi-cart-x"></i>
                <p>Giỏ hàng của bạn đang trống.</p>
            </div>
        );
    }

    return (
        <div className="cart-table">
            <div className="cart-table-head d-none d-md-flex">
                <span className="col-product">Sản phẩm</span>
                <span className="col-price">Đơn giá</span>
                <span className="col-qty">Số lượng</span>
                <span className="col-total">Tạm tính</span>
                <span className="col-remove"></span>
            </div>

            {items.map((item) => {
                const label = ribbonLabel(item.categoryType);
                return (
                    <div className="cart-row" key={item.id}>
                        <div className="col-product">
                            <img src={`${API_URL}${item.imageUrl}`} alt={item.name} />
                            <div>
                                <p className="cart-item-name" title={item.name}>{item.name}</p>
                                {label && (
                                    <span className={`category-ribbon ribbon-${item.categoryType} cart-ribbon`}>
                                        {label}
                                    </span>
                                )}
                            </div>
                        </div>

                        <span className="col-price cart-mono">{formatVND(item.price)}</span>

                        <div className="col-qty">
                            <div className="qty-stepper">
                                <button
                                    type="button"
                                    onClick={() => onDecrease(item.id)}
                                    disabled={item.quantity <= 1}
                                    aria-label="Giảm số lượng"
                                >
                                    <i className="bi bi-dash"></i>
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    type="button"
                                    onClick={() => onIncrease(item.id)}
                                    aria-label="Tăng số lượng"
                                >
                                    <i className="bi bi-plus"></i>
                                </button>
                            </div>
                        </div>

                        <span className="col-total cart-mono">{formatVND(item.price * item.quantity)}</span>

                        <button
                            type="button"
                            className="col-remove"
                            onClick={() => onRemove(item.id)}
                            aria-label={`Xoá ${item.name} khỏi giỏ hàng`}
                        >
                            <i className="bi bi-trash3"></i>
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default CartTable;