import React from 'react';

const API_URL = "https://localhost:7186";
const formatVND = (n) => `${n.toLocaleString('vi-VN')} ₫`;

const ribbonLabel = (categoryType) => {
    if (categoryType === 'tech') return 'Công nghệ';
    if (categoryType === 'dairy') return 'Dinh dưỡng';
    return null;
};

const CartTable = ({ items, onIncrease, onDecrease, onRemove }) => {
    if (!items || items.length === 0) {
        return (
            <div className="cart-empty text-center py-5">
                <i className="bi bi-cart-x" style={{ fontSize: '3rem' }}></i>
                <p>Giỏ hàng của bạn đang trống.</p>
            </div>
        );
    }

    return (
        <div className="cart-table">
            <div className="cart-table-head d-none d-md-flex p-3 border-bottom font-weight-bold">
                <span className="col-product flex-grow-1">Sản phẩm</span>
                <span className="col-price" style={{ width: '150px' }}>Đơn giá</span>
                <span className="col-qty" style={{ width: '150px' }}>Số lượng</span>
                <span className="col-total" style={{ width: '150px' }}>Tạm tính</span>
                <span className="col-remove" style={{ width: '50px' }}></span>
            </div>

            {items.map((item) => (
                <div className="cart-row d-flex align-items-center p-3 border-bottom" key={item.id}>
                    <div className="col-product flex-grow-1 d-flex align-items-center">
                        <img src={`${API_URL}${item.imageUrl}`} alt={item.name} style={{ width: '60px', marginRight: '15px' }} />
                        <div>
                            <p className="mb-0 font-weight-bold">{item.name}</p>
                            {ribbonLabel(item.categoryType) && (
                                <span className={`badge bg-info text-dark`}>{ribbonLabel(item.categoryType)}</span>
                            )}
                        </div>
                    </div>

                    <span className="col-price" style={{ width: '150px' }}>{formatVND(item.price)}</span>

                    <div className="col-qty" style={{ width: '150px' }}>
                        <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-secondary" onClick={() => onDecrease(item.id)} disabled={item.quantity <= 1}>-</button>
                            <span className="btn btn-light">{item.quantity}</span>
                            <button className="btn btn-outline-secondary" onClick={() => onIncrease(item.id)}>+</button>
                        </div>
                    </div>

                    <span className="col-total font-weight-bold" style={{ width: '150px' }}>{formatVND(item.price * item.quantity)}</span>

                    <button className="btn btn-link text-danger" onClick={() => onRemove(item.id)} aria-label="Xoá">
                        <i className="bi bi-trash3"></i>
                    </button>
                </div>
            ))}
        </div>
    );
};

export default CartTable;