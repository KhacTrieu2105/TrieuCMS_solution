import React from 'react';

// Header.jsx
const Header = () => (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top shadow-sm py-3">
        <div className="container">
            <a className="navbar-brand fw-bold text-primary fs-3" href="/">
                <i className="bi bi-shop me-2"></i>TrieuCMS
            </a>
            {/* Thanh tìm kiếm căn giữa đẹp hơn */}
            <div className="d-flex w-50 mx-auto">
                <input
                    className="form-control rounded-start-pill border-end-0 px-4"
                    placeholder="Tìm kiếm sản phẩm..."
                />
                <button className="btn btn-primary rounded-end-pill px-4">
                    <i className="bi bi-search"></i>
                </button>
            </div>
            <div className="d-flex gap-3">
                <button className="btn btn-outline-secondary rounded-circle"><i className="bi bi-cart"></i></button>
            </div>
        </div>
    </nav>
);
export default Header; // Bắt buộc phải là export default