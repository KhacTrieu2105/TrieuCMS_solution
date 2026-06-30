import React from 'react';
import CategoryMenu from '../Home/CategoryMenu';

const ShopSidebar = ({ onSelectCategory, onPriceChange }) => {
    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        onPriceChange(prev => ({
            ...prev,
            [name]: value === '' ? (name === 'min' ? 0 : 999999999) : Number(value)
        }));
    };

    return (
        <div className="bg-white p-3 rounded shadow-sm border">
            <h5 className="fw-bold mb-3">Danh mục</h5>
            <CategoryMenu onSelect={onSelectCategory} />
            <hr />
            <h5 className="fw-bold mb-3">Khoảng giá</h5>
            <div className="row g-2">
                <div className="col-6">
                    <input type="number" name="min" className="form-control form-control-sm" placeholder="Min" onChange={handlePriceChange} />
                </div>
                <div className="col-6">
                    <input type="number" name="max" className="form-control form-control-sm" placeholder="Max" onChange={handlePriceChange} />
                </div>
            </div>
        </div>
    );
};
export default ShopSidebar;