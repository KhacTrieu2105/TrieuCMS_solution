import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const FREE_SHIP_THRESHOLD = 500000;
const SHIPPING_FEE = 30000;
const ORDER_ENDPOINT = '/orders';

// Hàm load giỏ hàng theo đúng ID người dùng
const loadCart = () => {
    try {
        const customer = JSON.parse(localStorage.getItem('customer'));
        const customerId = customer ? customer.id : 'guest';
        const CART_KEY = `trieucms_cart_${customerId}`;
        const raw = localStorage.getItem(CART_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const initialForm = {
    fullName: '',
    phone: '',
    email: '',
    address: '',
    note: '',
    paymentMethod: 'cod',
};

const CheckoutPage = () => {
    // Lấy ID người dùng để định nghĩa KEY chuẩn xác
    const customer = JSON.parse(localStorage.getItem('customer'));
    const customerId = customer ? customer.id : 'guest';
    const CART_STORAGE_KEY = `trieucms_cart_${customerId}`;

    const [items] = useState(loadCart);
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [orderId, setOrderId] = useState(null);

    const subtotal = useMemo(() => items.reduce((sum, it) => sum + it.price * it.quantity, 0), [items]);
    const shippingFee = items.length === 0 ? 0 : subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = subtotal + shippingFee;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const next = {};

        if (!form.fullName.trim())
            next.fullName = "Vui lòng nhập họ tên";

        if (!/^0\d{9}$/.test(form.phone.trim()))
            next.phone = "Số điện thoại không hợp lệ";

        if (!form.email.trim())
            next.email = "Vui lòng nhập Email";
        else if (!/\S+@\S+\.\S+/.test(form.email))
            next.email = "Email không hợp lệ";

        if (!form.address.trim())
            next.address = "Vui lòng nhập địa chỉ";

        setErrors(next);

        return Object.keys(next).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError("");

        if (items.length === 0 || !validate()) return;

        const payload = {
            customerId: parseInt(customerId) || 0,
            email: form.email,
            notes:
                form.note.trim() === ""
                    ? "Không có ghi chú"
                    : form.note.trim(),

            items: items.map((it) => ({
                productId: parseInt(it.id),
                quantity: parseInt(it.quantity),
                price: parseFloat(it.price),
            })),
        };

        try {
            setIsSubmitting(true);

            const res = await axiosClient.post(ORDER_ENDPOINT, payload);

            localStorage.removeItem(CART_STORAGE_KEY);

            setOrderId(res?.data?.id ?? "N/A");
        } catch (err) {
            console.error(err);

            setSubmitError(
                err?.response?.data?.message || "Đặt hàng không thành công."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderId) {
        return (
            <div className="container py-5 text-center">
                <i className="bi bi-check-circle text-success" style={{ fontSize: '3rem' }}></i>
                <h4>Đặt hàng thành công!</h4>
                <p>Mã đơn hàng của bạn: <strong>#{orderId}</strong></p>
                <Link to="/" className="btn btn-primary mt-3">Về trang chủ</Link>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="container py-5 text-center">
                <p>Giỏ hàng đang trống.</p>
                <Link to="/" className="btn btn-outline-primary">Tiếp tục mua sắm</Link>
            </div>
        );
    }

    return (
        <div className="container checkout-page py-4">
            <h4 className="mb-4">Thông tin thanh toán</h4>
            <form className="checkout-layout" onSubmit={handleSubmit}>
                <div className="checkout-form">
                    <div className="form-group mb-3">
                        <label>Họ và tên</label>
                        <input name="fullName" className={`form-control ${errors.fullName ? 'is-invalid' : ''}`} value={form.fullName} onChange={handleChange} />
                        {errors.fullName && <div className="text-danger small">{errors.fullName}</div>}
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label>Số điện thoại</label>
                            <input name="phone" className={`form-control ${errors.phone ? 'is-invalid' : ''}`} value={form.phone} onChange={handleChange} />
                            {errors.phone && <div className="text-danger small">{errors.phone}</div>}
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Email</label>

                            <input
                                name="email"
                                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                value={form.email}
                                onChange={handleChange}
                            />

                            {errors.email &&
                                <div className="text-danger small">
                                    {errors.email}
                                </div>
                            }
                        </div>
                    </div>
                    <div className="form-group mb-3">
                        <label>Địa chỉ nhận hàng</label>
                        <input name="address" className={`form-control ${errors.address ? 'is-invalid' : ''}`} value={form.address} onChange={handleChange} />
                        {errors.address && <div className="text-danger small">{errors.address}</div>}
                    </div>
                    <div className="form-group mb-3">
                        <label>Ghi chú</label>
                        <textarea name="note" className="form-control" value={form.note} onChange={handleChange} />
                    </div>
                    {submitError && <div className="alert alert-danger">{submitError}</div>}
                </div>

                <aside className="checkout-summary card p-3">
                    <h6>Đơn hàng của bạn</h6>
                    <hr />
                    {items.map((it) => (
                        <div key={it.id} className="d-flex justify-content-between mb-2">
                            <span>{it.name} x {it.quantity}</span>
                            <span>{(it.price * it.quantity).toLocaleString('vi-VN')} ₫</span>
                        </div>
                    ))}
                    <hr />
                    <div className="d-flex justify-content-between"><span>Tạm tính</span> <span>{subtotal.toLocaleString('vi-VN')} ₫</span></div>
                    <div className="d-flex justify-content-between"><span>Vận chuyển</span> <span>{shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')} ₫`}</span></div>
                    <h5 className="mt-3">Tổng cộng: {total.toLocaleString('vi-VN')} ₫</h5>
                    <button type="submit" className="btn btn-primary w-100 mt-3" disabled={isSubmitting}>
                        {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
                    </button>
                </aside>
            </form>
        </div>
    );
};

export default CheckoutPage;