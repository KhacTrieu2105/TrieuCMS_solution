import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/customerService';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await authService.login({
                email: formData.email,
                password: formData.password
            });

            if (data.customerId) {
                // ĐỒNG BỘ: Lưu key 'id' để CartPage truy xuất được
                localStorage.setItem('customer', JSON.stringify({
                    id: data.customerId,
                    fullName: data.fullName,
                    email: formData.email
                }));

                alert("Đăng nhập thành công!");
                navigate('/');
                window.location.reload();
            } else {
                setError("Có lỗi xác thực tài khoản.");
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Email hoặc mật khẩu không đúng!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
            <div className="card shadow-sm border-0" style={{ maxWidth: '400px', width: '100%', borderRadius: '15px' }}>
                <div className="card-body p-5">
                    <h2 className="text-center mb-4">ĐĂNG NHẬP</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label>Email</label>
                            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label>Mật khẩu</label>
                            <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
                        </div>
                        <div className="text-end mt-2">
                            <Link to="/forgot-password">
                                Quên mật khẩu?
                            </Link>
                        </div>
                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                            {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;