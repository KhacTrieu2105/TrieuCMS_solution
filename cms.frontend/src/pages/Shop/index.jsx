import React, { useState, useEffect } from 'react';
import ShopSidebar from './ShopSidebar';
import ProductList from './ProductList';
import productService from '../../services/productService';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [priceRange, setPriceRange] = useState({
        min: 0,
        max: 999999999
    });
    const [categoryId, setCategoryId] = useState(null);

    useEffect(() => {

        const loadProducts = async () => {

            const data = await productService.filterProducts(
                categoryId,
                priceRange.min,
                priceRange.max
            );

            setProducts(data);

        };

        loadProducts();

    }, [categoryId, priceRange]);

    return (
        <div className="container py-4">
            <div className="row g-4">
                <div className="col-lg-3">
                    <ShopSidebar
                        onSelectCategory={setCategoryId}
                        onPriceChange={setPriceRange} // Truyền hàm để Sidebar cập nhật giá
                    />
                </div>
                <div className="col-lg-9">
                    {/* Truyền cả categoryId và priceRange xuống */}
                    <ProductList
                        categoryId={categoryId}
                        priceRange={priceRange}
                    />
                </div>
            </div>
        </div>
    );
};
export default Shop;