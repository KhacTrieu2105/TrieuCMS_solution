import React, { useState, useEffect } from 'react';
import ShopSidebar from './ShopSidebar';
import ShopHeader from './ShopHeader';
import LoadingOrEmpty from './LoadingOrEmpty';
import ProductList from './ProductList';
import productService from '../../services/productService';

const Shop = () => {
    const [categoryId, setCategoryId] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            const data = await productService.getAllProducts(); // Giả định service trả về data
            setProducts(data || []);
            setLoading(false);
        };
        loadProducts();
    }, [categoryId]);

    return (
        <div className="container py-4">
            <div className="row g-4">
                <div className="col-lg-3">
                    <ShopSidebar onSelectCategory={setCategoryId} />
                </div>
                <div className="col-lg-9">
                    <ShopHeader count={products.length} />
                    <LoadingOrEmpty isLoading={loading} isEmpty={products.length === 0} />
                    {!loading && <ProductList products={products} />}
                </div>
            </div>
        </div>
    );
};
export default Shop;