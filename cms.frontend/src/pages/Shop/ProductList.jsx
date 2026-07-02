import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';

const API_URL = "https://localhost:7186";

const ProductList = ({
    categoryId = null,
    priceRange = { min: 0, max: 999999999 }
}) => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // PHÂN TRANG
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;

    const navigate = useNavigate();

    const handleAddToCart = (product) => {
        const customer = JSON.parse(localStorage.getItem("customer"));

        if (!customer) {
            alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
            navigate("/login");
            return;
        }

        const CART_STORAGE_KEY = `trieucms_cart_${customer.id}`;

        const cart = JSON.parse(
            localStorage.getItem(CART_STORAGE_KEY) || "[]"
        );

        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }

        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(cart)
        );

        navigate("/cart");
    };

    useEffect(() => {

        setCurrentPage(1);

        const fetchData = async () => {

            setLoading(true);

            try {

                let data;

                data = await productService.filterProducts(
                    categoryId,
                    priceRange.min,
                    priceRange.max
                );

                setProducts(data);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }
        };

        fetchData();

    }, [categoryId, priceRange.min, priceRange.max]);

    // PHÂN TRANG

    const indexOfLastProduct = currentPage * productsPerPage;

    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

    const currentProducts = products.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );

    const totalPages = Math.ceil(
        products.length / productsPerPage
    );

    if (loading) {
        return (
            <div className="text-center py-5">
                Đang tải...
            </div>
        );
    }

    return (
        <>

            <div className="row row-cols-1 row-cols-md-3 g-4">

                {
                    currentProducts.length > 0 ?

                        currentProducts.map(product => (

                            <div key={product.id} className="col">

                                <div className="card h-100 shadow-sm border-0">

                                    <img
                                        src={`${API_URL}${product.imageUrl}`}
                                        alt={product.name}
                                        className="card-img-top"
                                        style={{
                                            height: "200px",
                                            objectFit: "cover"
                                        }}
                                    />

                                    <div className="card-body">

                                        <h6 className="fw-bold">
                                            {product.name}
                                        </h6>

                                        <p className="text-danger fw-bold">
                                            {product.price?.toLocaleString("vi-VN")} ₫
                                        </p>

                                        <div className="d-flex gap-2">

                                            <Link
                                                to={`/Product/Details/${product.id}`}
                                                className="btn btn-sm btn-outline-primary flex-grow-1"
                                            >
                                                Chi tiết
                                            </Link>

                                            <button
                                                className="btn btn-sm btn-primary flex-grow-1"
                                                onClick={() => handleAddToCart(product)}
                                            >
                                                Mua ngay
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ))

                        :

                        <p className="text-center w-100">
                            Không tìm thấy sản phẩm nào phù hợp.
                        </p>
                }

            </div>

            {
                totalPages > 1 &&

                <div className="d-flex justify-content-center mt-4">

                    <nav>

                        <ul className="pagination">

                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>

                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                >
                                    «
                                </button>

                            </li>

                            {
                                [...Array(totalPages)].map((_, index) => (

                                    <li
                                        key={index}
                                        className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                                    >

                                        <button
                                            className="page-link"
                                            onClick={() => setCurrentPage(index + 1)}
                                        >
                                            {index + 1}
                                        </button>

                                    </li>

                                ))
                            }

                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>

                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                >
                                    »
                                </button>

                            </li>

                        </ul>

                    </nav>

                </div>
            }

        </>
    );
};

export default ProductList;