import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import productService from '../../services/productService';
import ProductInfo from './ProductInfo';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error("Lỗi khi tải chi tiết:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="text-center mt-5"><h3>Đang tải...</h3></div>;
    if (!product) return <div className="text-center mt-5"><h3>Không tìm thấy sản phẩm.</h3></div>;

    return (
        <div className="container my-5">
            <ProductInfo product={product} />
        </div>
    );
};

export default ProductDetail;