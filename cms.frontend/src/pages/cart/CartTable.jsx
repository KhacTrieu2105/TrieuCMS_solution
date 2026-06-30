import React from 'react';

const API_URL = "https://localhost:7186";
const formatVND = (n) => `${n.toLocaleString('vi-VN')} ₫`;

const CartTable = ({ items, onIncrease, onDecrease, onRemove }) => {
    if (!items || items.length === 0) {
        return (
            <div className="text-center py-5 shadow-sm rounded bg-light">
                <i className="bi bi-cart-x text-muted" style={{ fontSize: '3rem' }}></i>
                <p className="mt-3 text-muted">Giỏ hàng của bạn đang trống.</p>
            </div>
        );
    }

    return (
        <div className="cart-table bg-white shadow-sm rounded overflow-hidden">
            {/* Header */}
            <div className="d-none d-md-flex p-3 border-bottom bg-light font-weight-bold">
                <span className="flex-grow-1 ps-2">Sản phẩm</span>
                <span style={{ width: '150px' }}>Đơn giá</span>
                <span style={{ width: '150px' }}>Số lượng</span>
                <span style={{ width: '150px' }}>Tạm tính</span>
                <span style={{ width: '80px' }}></span>
            </div>

            {/* Rows */}
            {items.map((item) => (
                <div className="d-flex align-items-center p-3 border-bottom cart-row-item" key={item.id}>
                    <div className="flex-grow-1 d-flex align-items-center">
                        <img
                            src={`${API_URL}${item.imageUrl}`}
                            alt={item.name}
                            className="rounded shadow-sm"
                            style={{ width: '70px', height: '70px', objectFit: 'cover', marginRight: '15px' }}
                        />
                        <span className="fw-bold">{item.name}</span>
                    </div>

                    <span style={{ width: '150px' }} className="text-muted">{formatVND(item.price)}</span>

                    <div style={{ width: '150px' }}>
                        <div className="btn-group btn-group-sm border rounded">
                            <button className="btn btn-light" onClick={() => onDecrease(item.id)} disabled={item.quantity <= 1}>-</button>
                            <span className="btn btn-light px-3 fw-bold">{item.quantity}</span>
                            <button className="btn btn-light" onClick={() => onIncrease(item.id)}>+</button>
                        </div>
                    </div>

                    <span style={{ width: '150px' }} className="fw-bold text-primary">{formatVND(item.price * item.quantity)}</span>

                    <div style={{ width: '80px' }} className="text-end">
                        <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => onRemove(item.id)}
                            title="Xóa sản phẩm"
                        >
                            <i className="bi bi-trash3"></i>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CartTable;