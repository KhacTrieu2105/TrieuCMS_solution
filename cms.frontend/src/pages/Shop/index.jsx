import React, { useState } from 'react';
import ShopSidebar from './ShopSidebar';
import ProductList from './ProductList';

const Shop = () => {
    const [categoryId, setCategoryId] = useState(null);
    // Thêm state cho giá
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000000 });

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