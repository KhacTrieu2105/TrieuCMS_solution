import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/productService';

const API_URL = "https://localhost:7186";

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await productService.getAllProducts();
                setProducts(data || []);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="row row-cols-1 row-cols-md-4 g-3">
            {products.map(product => (
                <div key={product.id} className="col">
                    <div className="card h-100 shadow-sm border-0 transition-card">
                        <img
                            src={`${API_URL}${product.imageUrl}`}
                            className="card-img-top p-2"
                            alt={product.name}
                            style={{ height: "180px", objectFit: "contain" }}
                        />
                        <div className="card-body d-flex flex-column">
                            <h6 className="card-title" style={{ fontSize: '0.9rem', height: '40px' }}>
                                {product.name}
                            </h6>
                            <p className="text-danger fw-bold mb-2">
                                {product.price?.toLocaleString('vi-VN')} ₫
                            </p>
                            <div className="d-flex gap-1 mt-auto">
                                <Link
                                    to={`/Product/Details/${product.id}`}
                                    className="btn btn-sm btn-outline-primary w-50"
                                >
                                    Chi tiết
                                </Link>
                                <button className="btn btn-sm btn-primary w-50">Mua ngay</button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductList;