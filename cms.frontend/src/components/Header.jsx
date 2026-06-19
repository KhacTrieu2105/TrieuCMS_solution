import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    const [cartCount] = useState(0);

    // Hàm thông báo tính năng đang phát triển
    const handleFeatureDevelopment = (e) => {
        e.preventDefault(); // Ngăn chuyển trang
        alert("Tính năng này đang được phát triển. Vui lòng quay lại sau!");
    };

    return (
        <header className="site-header sticky-top bg-white shadow-sm">
            {/* Thanh thông báo trên cùng */}
            <div className="header-topbar py-1 border-bottom">
                <div className="container d-flex justify-content-between align-items-center">
                    <span className="topbar-text text-muted small">
                        <i className="bi bi-truck me-2"></i> Miễn phí vận chuyển cho đơn hàng từ 500.000₫
                    </span>
                    <div className="d-none d-md-flex gap-4 topbar-links">
                        <a href="#" onClick={handleFeatureDevelopment}>Liên hệ</a>
                        <a href="#" onClick={handleFeatureDevelopment}><i className="bi bi-person me-1"></i>Tài khoản</a>
                    </div>
                </div>
            </div>

            {/* Thanh chính */}
            <nav className="navbar navbar-expand-lg main-navbar py-3">
                <div className="container d-flex align-items-center gap-4">
                    <a className="brand-logo text-decoration-none text-dark fw-bold fs-4" href="/">
                        <i className="bi bi-shop text-primary me-2"></i>
                        <span>Trieu<strong>CMS</strong></span>
                    </a>

                    {/* Tìm kiếm */}
                    <div className="search-pill flex-grow-1 d-none d-md-flex border rounded-pill overflow-hidden">
                        <input
                            type="text"
                            className="form-control border-0 px-3"
                            placeholder="Tìm laptop, điện thoại..."
                            aria-label="Tìm kiếm sản phẩm"
                        />
                        <button className="btn btn-primary px-4" onClick={handleFeatureDevelopment}>
                            <i className="bi bi-search">Tìm Kiếm </i>
                        </button>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        <button className="icon-btn btn btn-light d-md-none" onClick={handleFeatureDevelopment}>
                            <i className="bi bi-search"> Tìm kiếm</i>
                        </button> 

                        {/* Đăng nhập/Đăng ký */}
                        <div className="d-flex gap-2">
                            <Link to="/login" onClick={handleFeatureDevelopment} className="text-decoration-none text-dark">Đăng nhập</Link>
                            <span className="text-muted">|</span>
                            <Link to="/register" onClick={handleFeatureDevelopment} className="text-decoration-none text-primary fw-bold">Đăng ký</Link>
                        </div>

                        {/* Giỏ hàng */}
                        <Link to="/cart" className="btn btn-primary rounded-pill position-relative px-3">
                            <i className="bi bi-cart3 me-1"></i>
                            <span className="d-none d-md-inline">Giỏ hàng</span>
                            {cartCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Thanh danh mục */}
            <div className="category-bar border-top">
                <div className="container d-flex gap-4 py-2">
                    <a href="/" className="category-link text-decoration-none text-dark"><i className="bi bi-house"></i> Trang Chủ</a>
                    <a href="/shop" className="category-link text-decoration-none text-dark"><i className="bi bi-shop"></i> Cửa hàng</a>
                    <a href="/blog" className="category-link text-decoration-none text-dark"><i className="bi bi-journal-text"></i> Bài viết</a>
                </div>
            </div>
        </header>
    );
};

export default Header;