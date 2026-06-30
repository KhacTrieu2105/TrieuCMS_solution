import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';

const API_URL = "https://localhost:7186";

const SearchResult = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Logic thêm vào giỏ hàng (tái sử dụng lại logic của ProductList)
    const handleAddToCart = (product) => {
        const customer = JSON.parse(localStorage.getItem('customer'));
        if (!customer) {
            alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
            navigate('/login');
            return;
        }
        const CART_STORAGE_KEY = `trieucms_cart_${customer.id}`;
        const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        navigate('/cart');
    };

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const allProducts = await productService.getAllProducts();
                // Lọc sản phẩm theo tên (không phân biệt hoa thường)
                const filtered = allProducts.filter(p =>
                    p.name.toLowerCase().includes(query.toLowerCase())
                );
                setResults(filtered);
            } catch (error) {
                console.error("Lỗi tìm kiếm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [query]);

    return (
        <div className="container py-5">
            <h4 className="mb-4">Kết quả tìm kiếm cho: <span className="text-primary">"{query}"</span></h4>

            {loading ? (
                <div className="text-center py-5">Đang tìm kiếm...</div>
            ) : (
                <div className="row row-cols-1 row-cols-md-4 g-4">
                    {results.length > 0 ? (
                        results.map(product => (
                            <div key={product.id} className="col">
                                <div className="card h-100 shadow-sm border-0">
                                    <img
                                        src={`${API_URL}${product.imageUrl}`}
                                        className="card-img-top"
                                        alt={product.name}
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                    <div className="card-body">
                                        <h6 className="fw-bold">{product.name}</h6>
                                        <p className="text-danger fw-bold">{product.price?.toLocaleString('vi-VN')} ₫</p>
                                        <div className="d-flex gap-2">
                                            <Link to={`/Product/Details/${product.id}`} className="btn btn-sm btn-outline-primary flex-grow-1">
                                                Chi tiết
                                            </Link>
                                            <button className="btn btn-sm btn-primary flex-grow-1" onClick={() => handleAddToCart(product)}>
                                                Mua ngay
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                                <p className="w-100 text-center text-muted">Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchResult;