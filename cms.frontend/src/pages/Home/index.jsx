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
            <div className="row g-4">
                <div className="col-lg-2">
                    <CategoryMenu onSelect={setCategoryId} />
                </div>
                <div className="col-lg-10">
                    <ProductGrid categoryId={categoryId} />
                </div>
            </div>
            <LatestBlog />
        </div>
    );
};
export default Home;