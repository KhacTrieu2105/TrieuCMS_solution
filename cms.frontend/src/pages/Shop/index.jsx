import React, { useState } from 'react';
import ShopSidebar from './ShopSidebar';
import ShopHeader from './ShopHeader';
import ProductList from './ProductList';

const Shop = () => {
    // Chỉ giữ state categoryId ở đây để truyền xuống
    const [categoryId, setCategoryId] = useState(null);

    return (
        <div className="container py-4">
            <div className="row g-4">
                <div className="col-lg-3">
                    <ShopSidebar onSelectCategory={setCategoryId} />
                </div>
                <div className="col-lg-9">
                    {/* Truyền categoryId xuống để ProductList tự quản lý việc lấy dữ liệu */}
                    <ProductList categoryId={categoryId} />
                </div>
            </div>
        </div>
    );
};
export default Shop;