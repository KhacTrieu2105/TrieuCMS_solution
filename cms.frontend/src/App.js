import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/product-detail';
import BlogPage from './pages/blog'; // Đây là tên bạn đã import
import Header from './components/Header';
import Footer from './components/Footer';
import CartPage from './pages/cart';
import CheckoutPage from './pages/checkout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import './assets/theme.css';

function App() {
    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Header />
            <main className="flex-grow-1">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/Product/Details/:id" element={<ProductDetail />} />
                    {/* SỬA CHỖ NÀY: Dùng BlogPage thay vì PostDetail */}
                    <Route path="/Post/Details/:id" element={<BlogPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}
export default App;