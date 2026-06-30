import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';

const API_URL = "https://localhost:7186";

// Gán giá trị mặc định cho priceRange để không bị lỗi ở các trang khác
const ProductList = ({ categoryId = null, priceRange = { min: 0, max: 999999999 } }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
        const fetchData = async () => {
            setLoading(true);
            try {
                let data = [];
                // Nếu service có hàm lọc, dùng hàm lọc, ngược lại dùng lấy tất cả rồi lọc thủ công
                if (productService.getProductsByFilter) {
                    data = await productService.getProductsByFilter(categoryId, priceRange.min, priceRange.max);
                } else {
                    const all = await productService.getAllProducts();
                    data = all.filter(p =>
                        (!categoryId || p.categoryId === categoryId) &&
                        (p.price >= priceRange.min && p.price <= priceRange.max)
                    );
                }
                setProducts(data || []);
            } catch (error) {
                console.error("Lỗi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [categoryId, priceRange.min, priceRange.max]); // Theo dõi kỹ sự thay đổi của giá

    if (loading) return <div className="text-center py-5">Đang tải...</div>;

    return (
        <div className="row row-cols-1 row-cols-md-3 g-4">
            {products.length > 0 ? products.map(product => (
                <div key={product.id} className="col">
                    <div className="card h-100 shadow-sm border-0">
                        <img src={`${API_URL}${product.imageUrl}`} className="card-img-top" alt={product.name} style={{ height: "200px", objectFit: "cover" }} />
                        <div className="card-body">
                            <h6 className="fw-bold">{product.name}</h6>
                            <p className="text-danger fw-bold">{product.price?.toLocaleString('vi-VN')} ₫</p>
                            <div className="d-flex gap-2">
                                <Link to={`/Product/Details/${product.id}`} className="btn btn-sm btn-outline-primary flex-grow-1">Chi tiết</Link>
                                <button className="btn btn-sm btn-primary flex-grow-1" onClick={() => handleAddToCart(product)}>Mua ngay</button>
                            </div>
                        </div>
                    </div>
                </div>
            )) : <p className="text-center w-100"> Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn.</p>}
        </div>
    );
};
export default ProductList;