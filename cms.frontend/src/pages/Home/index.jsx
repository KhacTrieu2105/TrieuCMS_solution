import React, { useState } from 'react';
import CategoryMenu from './CategoryMenu';
import HeroBanner from './HeroBanner';
import ProductGrid from './ProductGrid';
import LatestBlog from './LatestBlog';

const Home = () => {
    const [categoryId, setCategoryId] = useState(null);

    return (
        <div className="container py-4">
            <HeroBanner />

            {/* Đưa danh mục lên trên và dàn ngang */}
            <div className="mb-4">
                <CategoryMenu onSelect={setCategoryId} />
            </div>

            {/* ProductGrid sẽ nằm trọn chiều ngang bên dưới */}
            <ProductGrid categoryId={categoryId} />

            <LatestBlog />
        </div>
    );
};
export default Home;