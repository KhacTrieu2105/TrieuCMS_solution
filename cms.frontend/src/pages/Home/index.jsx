import React, { useState } from 'react';
import CategoryMenu from './CategoryMenu';
import HeroBanner from './HeroBanner';
import ProductGrid from './ProductGrid';
import LatestBlog from './LatestBlog';
import HotProducts from './HotProducts'; // Đảm bảo đường dẫn này đúng với vị trí file của bạn

const Home = () => {
    const [categoryId, setCategoryId] = useState(null);

    return (
        <div className="home-page">
            {/* Hero Banner chiếm trọn chiều ngang */}
            <HeroBanner />

            {/* Khu vực sản phẩm bán chạy */}
            <div className="my-4">
                <HotProducts />
            </div>

            <div className="container py-4">
                {/* Danh mục */}
                <div className="mb-4">
                    <CategoryMenu onSelect={setCategoryId} />
                </div>

                {/* Danh sách sản phẩm */}
                <ProductGrid categoryId={categoryId} />

                {/* Tin tức/Blog */}
                <LatestBlog />
            </div>
        </div>
    );
};

export default Home;