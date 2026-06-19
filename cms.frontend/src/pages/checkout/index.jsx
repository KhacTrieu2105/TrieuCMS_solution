import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
// Đường dẫn này giả định file nằm ở src/pages/checkout/index.jsx
// và axiosClient nằm ở src/api/axiosClient.js — chỉnh lại nếu cấu trúc khác.
import axiosClient from '../../api/axiosClient';

const CART_STORAGE_KEY = 'trieucms_cart';
const FREE_SHIP_THRESHOLD = 500000;
const SHIPPING_FEE = 30000;

// TODO: đổi lại đúng route API tạo đơn hàng bên ASP.NET của bạn
const ORDER_ENDPOINT = '/api/orders';

const loadCart = () => {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
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

// Form điền dữ liệu Customer và bấm nút đặt hàng (POST đơn hàng)
const CheckoutPage = () => {
    const [items] = useState(loadCart);
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [orderId, setOrderId] = useState(null);

    const subtotal = useMemo(
        () => items.reduce((sum, it) => sum + it.price * it.quantity, 0),
        [items]
    );
    const shippingFee = items.length === 0 ? 0 : subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = subtotal + shippingFee;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const next = {};
        if (!form.fullName.trim()) next.fullName = 'Vui lòng nhập họ tên';
        if (!/^0\d{9}$/.test(form.phone.trim())) {
            next.phone = 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)';
        }
        if (!form.address.trim()) next.address = 'Vui lòng nhập địa chỉ nhận hàng';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        if (items.length === 0 || !validate()) return;

        const payload = {
            customer: {
                fullName: form.fullName.trim(),
                phone: form.phone.trim(),
                email: form.email.trim(),
                address: form.address.trim(),
                note: form.note.trim(),
            },
            paymentMethod: form.paymentMethod,
            items: items.map((it) => ({
                productId: it.id,
                quantity: it.quantity,
                price: it.price,
            })),
            shippingFee,
            total,
        };

        try {
            setIsSubmitting(true);
            const res = await axiosClient.post(ORDER_ENDPOINT, payload);
            localStorage.removeItem(CART_STORAGE_KEY);
            setOrderId(res?.data?.id ?? res?.data?.orderId ?? 'N/A');
        } catch (err) {
            setSubmitError(
                err?.response?.data?.message || 'Đặt hàng không thành công, vui lòng thử lại.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Đặt hàng thành công
    if (orderId) {
        return (
            <div className="container">
                <div className="checkout-success">
                    <i className="bi bi-check-circle"></i>
                    <h4>Đặt hàng thành công!</h4>
                    <p>Mã đơn hàng của bạn: <strong className="cart-mono">#{orderId}</strong></p>
                    <p>Chúng tôi sẽ liên hệ qua số điện thoại bạn đã cung cấp để xác nhận đơn hàng.</p>
                    <Link to="/" className="cart-continue">Về trang chủ</Link>
                </div>
            </div>
        );
    }

    // Giỏ hàng trống thì không có gì để thanh toán
    if (items.length === 0) {
        return (
            <div className="container">
                <div className="checkout-empty">
                    <i className="bi bi-cart-x"></i>
                    <p>Giỏ hàng đang trống, không có gì để thanh toán.</p>
                    <Link to="/" className="cart-continue">Quay về trang chủ</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container checkout-page">
            <h4 className="cart-page-title">Thông tin thanh toán</h4>

            <form className="checkout-layout" onSubmit={handleSubmit}>
                <div className="checkout-form">
                    <div className="form-group">
                        <label htmlFor="fullName">Họ và tên</label>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            value={form.fullName}
                            onChange={handleChange}
                            className={errors.fullName ? 'is-invalid' : ''}
                            placeholder="Nguyễn Văn A"
                        />
                        {errors.fullName && <span className="field-error">{errors.fullName}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="phone">Số điện thoại</label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={form.phone}
                                onChange={handleChange}
                                className={errors.phone ? 'is-invalid' : ''}
                                placeholder="09xxxxxxxx"
                            />
                            {errors.phone && <span className="field-error">{errors.phone}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email (không bắt buộc)</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="email@example.com"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Địa chỉ nhận hàng</label>
                        <input
                            id="address"
                            name="address"
                            type="text"
                            value={form.address}
                            onChange={handleChange}
                            className={errors.address ? 'is-invalid' : ''}
                            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                        />
                        {errors.address && <span className="field-error">{errors.address}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="note">Ghi chú (không bắt buộc)</label>
                        <textarea
                            id="note"
                            name="note"
                            rows="3"
                            value={form.note}
                            onChange={handleChange}
                            placeholder="Ví dụ: giao giờ hành chính, gọi trước khi giao..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Phương thức thanh toán</label>
                        <div className="payment-options">
                            <label className={`payment-option ${form.paymentMethod === 'cod' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cod"
                                    checked={form.paymentMethod === 'cod'}
                                    onChange={handleChange}
                                />
                                <i className="bi bi-cash-coin"></i>
                                <div>
                                    <strong>Thanh toán khi nhận hàng (COD)</strong>
                                    <p>Trả tiền mặt cho shipper khi nhận hàng</p>
                                </div>
                            </label>
                            <label className={`payment-option ${form.paymentMethod === 'bank' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="bank"
                                    checked={form.paymentMethod === 'bank'}
                                    onChange={handleChange}
                                />
                                <i className="bi bi-bank"></i>
                                <div>
                                    <strong>Chuyển khoản ngân hàng</strong>
                                    <p>Thông tin chuyển khoản gửi qua email/SMS sau khi đặt hàng</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {submitError && <div className="checkout-submit-error">{submitError}</div>}
                </div>

                <aside className="cart-summary checkout-summary">
                    <h6>Đơn hàng của bạn</h6>
                    <ul className="checkout-mini-list">
                        {items.map((it) => (
                            <li key={it.id}>
                                <span>{it.name} <span className="cart-mono">× {it.quantity}</span></span>
                                <span className="cart-mono">{(it.price * it.quantity).toLocaleString('vi-VN')} ₫</span>
                            </li>
                        ))}
                    </ul>
                    <hr />
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

                    <button type="submit" className="cart-checkout-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
                    </button>
                </aside>
            </form>
        </div>
    );
};

export default CheckoutPage;