import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CategoryProductList from './components/CategoryProductList';
import ProductList from './components/ProductList';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import ProductDetail from './components/ProductDetail';

function App() {
    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Header */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
                <div className="container">
                    <a className="navbar-brand fw-bold" href="/">ThaiCMS Shop</a>
                    <div className="d-flex w-50">
                        <input className="form-control me-2" type="search" placeholder="Tìm kiếm sản phẩm..." />
                        <button className="btn btn-light">Tìm</button>
                    </div>
                </div>
            </nav>

            {/* Main Content Area - Điều hướng tại đây */}
            <main className="flex-grow-1">
                <Routes>
                    {/* Route Trang chủ */}
                    <Route path="/" element={
                        <div className="container my-4">
                            <div className="row">
                                <div className="col-md-2">
                                    <div className="bg-primary text-white p-2 text-center rounded-top fw-bold">
                                        <i className="bi bi-list"></i> DANH MỤC SP
                                    </div>
                                    <div className="shadow-sm"><CategoryProductList /></div>
                                </div>
                                <div className="col-md-10">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h4 className="fw-bold">SẢN PHẨM NỔI BẬT</h4>
                                        <span className="text-muted small">Hiển thị danh sách sản phẩm</span>
                                    </div>
                                    <ProductList />
                                </div>
                            </div>

                            <div className="mt-5">
                                <div className="text-center mb-5">
                                    <h2 className="fw-bold text-danger">XU HƯỚNG CÔNG NGHỆ</h2>
                                    <hr className="w-25 mx-auto text-danger" />
                                </div>
                                <PostList />
                            </div>
                        </div>
                    } />

                    {/* Route Chi tiết bài viết */}
                    <Route path="/Post/Details/:id" element={<PostDetail />} />
                    <Route path="/Product/Details/:id" element={<ProductDetail />} />
                </Routes>
            </main>

            {/* Footer */}
            <footer className="bg-dark text-white py-4 mt-auto">
                <div className="container text-center">
                    <h5>ThaiCMS Shop</h5>
                    <p className="mb-1">Website bán hàng ASP.NET Core MVC + ReactJS</p>
                    <small>© 2026 ThaiCMS Retail. All Rights Reserved.</small>
                </div>
            </footer>

            <style>{`
                .transition-card { transition: transform 0.3s ease; }
                .transition-card:hover { 
                    transform: translateY(-5px); 
                    box-shadow: 0 10px 20px rgba(0,0,0,0.15) !important; 
                }
            `}</style>
        </div>
    );
}

export default App;