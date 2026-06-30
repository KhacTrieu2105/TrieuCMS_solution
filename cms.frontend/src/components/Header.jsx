import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const [user, setUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // State lưu từ khóa tìm kiếm
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);

    // Đọc thông tin người dùng từ localStorage
    useEffect(() => {
        const storedCustomer = localStorage.getItem("customer");
        if (storedCustomer && storedCustomer !== "undefined" && storedCustomer !== "null") {
            try {
                const parsedCustomer = JSON.parse(storedCustomer);
                setUser(parsedCustomer);
            } catch (error) {
                console.error("Lỗi parse dữ liệu:", error);
                localStorage.removeItem("customer");
            }
        }
    }, []);

    useEffect(() => {

        const storedCustomer = localStorage.getItem("customer");

        if (storedCustomer && storedCustomer !== "undefined" && storedCustomer !== "null") {

            try {

                const parsedCustomer = JSON.parse(storedCustomer);

                setUser(parsedCustomer);

            } catch {

                localStorage.removeItem("customer");

            }

        }

        getCartCount();

    }, []);

    useEffect(() => {

        const handleStorage = () => {

            getCartCount();

        };

        window.addEventListener("storage", handleStorage);

        window.addEventListener("cartUpdated", handleStorage);

        return () => {

            window.removeEventListener("storage", handleStorage);

            window.removeEventListener("cartUpdated", handleStorage);

        };

    }, []);
    const getCartCount = () => {

        const customer = JSON.parse(localStorage.getItem("customer"));

        if (!customer) {
            setCartCount(0);
            return;
        }

        const CART_STORAGE_KEY = `trieucms_cart_${customer.id}`;

        try {

            const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];

            const total = cart.reduce((sum, item) => sum + item.quantity, 0);

            setCartCount(total);

        } catch {

            setCartCount(0);

        }
    };
    // Xử lý tìm kiếm
    const handleSearch = () => {
        if (searchTerm.trim()) {
            // Điều hướng sang trang tìm kiếm với query string
            navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
            setSearchTerm(""); // Xóa trắng ô tìm kiếm sau khi nhấn
        }
    };

    // Cho phép tìm kiếm khi nhấn phím Enter
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Đăng xuất
    const handleLogout = () => {
        localStorage.removeItem("customer");
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
                        <i className="bi bi-truck me-2"></i>
                        Miễn phí vận chuyển cho đơn hàng từ 500.000₫
                    </span>
                    <div className="d-none d-md-flex gap-4 topbar-links">
                        <a href="#" onClick={handleFeatureDevelopment} className="text-decoration-none text-muted">
                            Liên hệ
                        </a>
                    </div>
                </div>
            </div>

            {/* Navbar */}
            <nav className="navbar navbar-expand-lg main-navbar py-3">
                <div className="container d-flex align-items-center gap-4">
                    {/* Logo */}
                    <Link className="brand-logo text-decoration-none text-dark fw-bold fs-4" to="/">
                        <i className="bi bi-shop text-primary me-2"></i>
                        <span>Trieu<strong>CMS</strong></span>
                    </Link>

                    {/* Search */}
                    <div className="search-pill flex-grow-1 d-none d-md-flex border rounded-pill overflow-hidden">
                        <input
                            type="text"
                            className="form-control border-0 px-3"
                            placeholder="Tìm sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button className="btn btn-primary px-4" onClick={handleSearch}>
                            <i className="bi bi-search"> Tìm Kiếm</i>
                        </button>
                    </div>

                    {/* User & Cart */}
                    <div className="d-flex align-items-center gap-3">
                        {user ? (
                            <>
                                <span className="text-primary fw-bold text-truncate" style={{ maxWidth: "150px" }}>
                                    {user.fullName || user.username}
                                </span>
                                <Link to="/profile" className="btn btn-sm btn-outline-primary">
                                    <i className="bi bi-person-circle me-1"></i> Profile
                                </Link>
                                <button onClick={handleLogout} className="btn btn-sm btn-outline-danger">
                                    <i className="bi bi-box-arrow-right me-1"></i> Đăng xuất
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-decoration-none text-dark">Đăng nhập</Link>
                                <span className="text-muted">|</span>
                                <Link to="/register" className="text-decoration-none text-primary fw-bold">Đăng ký</Link>
                            </>
                        )}
                        <Link
                            to="/cart"
                            className="btn btn-primary rounded-pill position-relative px-3"
                        >
                            <i className="bi bi-cart3 me-1"></i>

                            <span className="d-none d-md-inline">
                                Giỏ hàng
                            </span>

                            {cartCount > 0 && (

                                <span
                                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                >
                                    {cartCount}
                                </span>

                            )}

                        </Link>
                    </div>
                </div>
            </nav>

            {/* Category */}
            <div className="category-bar border-top">
                <div className="container d-flex gap-4 py-2">
                    <Link to="/" className="category-link text-decoration-none text-dark">
                        <i className="bi bi-house"></i> Trang Chủ
                    </Link>
                    <Link to="/shop" className="category-link text-decoration-none text-dark">
                        <i className="bi bi-shop"></i> Cửa hàng
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;