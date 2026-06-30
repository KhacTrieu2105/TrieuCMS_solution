import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartTable from './CartTable';

const FREE_SHIP_THRESHOLD = 500000;
const SHIPPING_FEE = 30000;

const CartPage = () => {
    const navigate = useNavigate();

    // 1. Lấy thông tin customer (Hooks phải nằm trên cùng)
    const customer = JSON.parse(localStorage.getItem('customer'));
    const customerId = customer ? customer.id : null;

    // 2. Khởi tạo giỏ hàng (Hooks không được nằm sau lệnh return/if)
    const [items, setItems] = useState(() => {
        try {
            const savedCart = customerId ? localStorage.getItem(`trieucms_cart_${customerId}`) : null;
            return savedCart ? JSON.parse(savedCart) : [];
        } catch { return []; }
    });

    // 3. Effect kiểm tra đăng nhập
    useEffect(() => {
        if (!customer) {
            alert("Bạn cần đăng nhập để xem giỏ hàng!");
            navigate('/login');
        }
    }, [customer, navigate]);

    // 4. Lưu giỏ hàng
    useEffect(() => {
        if (customerId) {
            localStorage.setItem(`trieucms_cart_${customerId}`, JSON.stringify(items));
            window.dispatchEvent(new Event("cartUpdated"));
        }
    }, [items, customerId]);

    // 5. Memo hóa tính toán
    const subtotal = useMemo(() => items.reduce((sum, it) => sum + it.price * it.quantity, 0), [items]);
    const shippingFee = items.length === 0 ? 0 : (subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE);

    // 6. Sau khi tất cả hooks đã được gọi, mới thực hiện kiểm tra để return
    if (!customer) return null;

    // Các hàm xử lý giỏ hàng
    const increase = (id) => setItems(prev => prev.map(it => it.id === id ? { ...it, quantity: it.quantity + 1 } : it));
    const decrease = (id) => setItems(prev => prev.map(it => it.id === id && it.quantity > 1 ? { ...it, quantity: it.quantity - 1 } : it));
    const remove = (id) => setItems(prev => prev.filter(it => it.id !== id));

    return (
        <div className="container py-4">
            <h4>Giỏ hàng của bạn (Tài khoản: {customer.fullName})</h4>
            <div className="row">
                <div className="col-lg-8">
                    <CartTable items={items} onIncrease={increase} onDecrease={decrease} onRemove={remove} />
                    {items.length > 0 && <Link to="/" className="btn btn-link mt-3">← Tiếp tục mua hàng</Link>}
                </div>
                <div className="col-lg-4">
                    <div className="card p-3">
                        <h5>Tóm tắt đơn hàng</h5>
                        <div className="d-flex justify-content-between my-2"><span>Tạm tính</span> <span>{subtotal.toLocaleString('vi-VN')} ₫</span></div>
                        <div className="d-flex justify-content-between my-2"><span>Phí vận chuyển</span> <span>{shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')} ₫`}</span></div>
                        <hr />
                        <div className="d-flex justify-content-between font-weight-bold"><h5>Tổng cộng</h5> <h5>{(subtotal + shippingFee).toLocaleString('vi-VN')} ₫</h5></div>
                        <button className="btn btn-primary w-100 mt-3" disabled={items.length === 0} onClick={() => navigate('/checkout')}>
                            Tiến hành thanh toán
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;