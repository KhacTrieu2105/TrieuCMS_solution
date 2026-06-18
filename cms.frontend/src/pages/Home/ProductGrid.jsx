import React from 'react';
import ProductList from '../Shop/ProductList';

const ProductGrid = ({ categoryId }) => {
    return (
        <div className="bg-white p-4 rounded shadow-sm border">
            <h3 className="fw-bold mb-4">SẢN PHẨM NỔI BẬT</h3>
            <ProductList categoryId={categoryId} />
        </div>
    );
};
export default ProductGrid;