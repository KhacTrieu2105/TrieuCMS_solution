import React, { useState } from 'react';
import CategoryMenu from './CategoryMenu';
import HeroBanner from './HeroBanner';
import ProductGrid from './ProductGrid';
import LatestBlog from './LatestBlog';
import HotProducts from './HotProducts';
import LatestProducts from './LatestProducts';

const Home = () => {
    const [categoryId, setCategoryId] = useState(null);

    return (
        <div className="home-page">

            {/* Hero Banner */}
            <HeroBanner />

            {/* Sản phẩm bán chạy */}
            <div className="my-4">
                <HotProducts />
            </div>

            <div className="container py-4">

                {/* ====== Sản phẩm mới ====== */}
                <div className="mb-5">
                    <LatestProducts />
                </div>

                {/* ====== Danh mục ====== */}
                <div className="mb-4">
                    <CategoryMenu onSelect={setCategoryId} />
                </div>

                {/* ====== Danh sách sản phẩm ====== */}
                <div className="mb-5">
                    <ProductGrid categoryId={categoryId} />
                </div>

                {/* ====== Tin tức ====== */}
                <LatestBlog />

            </div>

        </div>
    );
};

export default Home;