import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // 1. Đồng bộ: Đọc dữ liệu từ key 'customer'
    useEffect(() => {
        const storedCustomer = localStorage.getItem("customer");

        if (storedCustomer && storedCustomer !== "undefined" && storedCustomer !== "null") {
            try {
                const parsedCustomer = JSON.parse(storedCustomer);
                setUser(parsedCustomer);
            } catch (error) {
                console.error("Lỗi parse dữ liệu từ localStorage:", error);
                localStorage.removeItem("customer");
            }
        }
    }, []);

    // 2. Đồng bộ: Xóa đúng key 'customer'
    // Trong Header.jsx, cập nhật hàm handleLogout
    const handleLogout = () => {
        localStorage.removeItem("customer");
        // Không cần xóa key giỏ hàng, nhưng bạn nên reload để state giỏ hàng reset
        navigate("/");
        window.location.reload();
    };

    const handleFeatureDevelopment = (e) => {
        e.preventDefault();
        alert("Tính năng này đang được phát triển. Vui lòng quay lại sau!");
    };

    return (
        <header className="site-header sticky-top bg-white shadow-sm">
            {/* Topbar */}
            <div className="header-topbar py-1 border-bottom">
                <div className="container d-flex justify-content-between align-items-center">
                    <span className="topbar-text text-muted small">
                        <i className="bi bi-truck me-2"></i> Miễn phí vận chuyển cho đơn hàng từ 500.000₫
                    </span>
                    <div className="d-none d-md-flex gap-4 topbar-links">
                        <a href="#" onClick={handleFeatureDevelopment}>Liên hệ</a>
                    </div>
                </div>
            </div>

            {/* Navbar chính */}
            <nav className="navbar navbar-expand-lg main-navbar py-3">
                <div className="container d-flex align-items-center gap-4">
                    <Link className="brand-logo text-decoration-none text-dark fw-bold fs-4" to="/">
                        <i className="bi bi-shop text-primary me-2"></i>
                        <span>Trieu<strong>CMS</strong></span>
                    </Link>

                    {/* Tìm kiếm */}
                    <div className="search-pill flex-grow-1 d-none d-md-flex border rounded-pill overflow-hidden">
                        <input type="text" className="form-control border-0 px-3" placeholder="Tìm sản phẩm..." />
                        <button className="btn btn-primary px-4"><i className="bi bi-search"></i></button>
                    </div>

                    {/* User Action & Cart */}
                    <div className="d-flex align-items-center gap-3">
                        <div className="d-flex gap-2 align-items-center">
                            {user ? (
                                <>
                                    <span className="text-primary fw-bold text-truncate" style={{ maxWidth: '120px' }}>
                                        Chào, {user.fullName || user.username}
                                    </span>
                                    <button onClick={handleLogout} className="btn btn-sm btn-outline-danger">Đăng xuất</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-decoration-none text-dark">Đăng nhập</Link>
                                    <span className="text-muted">|</span>
                                    <Link to="/register" className="text-decoration-none text-primary fw-bold">Đăng ký</Link>
                                </>
                            )}
                        </div>

                        <Link to="/cart" className="btn btn-primary rounded-pill position-relative px-3">
                            <i className="bi bi-cart3 me-1"></i>
                            <span className="d-none d-md-inline">Giỏ hàng</span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Category Bar */}
            <div className="category-bar border-top">
                <div className="container d-flex gap-4 py-2">
                    <Link to="/" className="category-link text-decoration-none text-dark"><i className="bi bi-house"></i> Trang Chủ</Link>
                    <Link to="/shop" className="category-link text-decoration-none text-dark"><i className="bi bi-shop"></i> Cửa hàng</Link>
                </div>
            </div>
        </header>
    );
};

export default Header;