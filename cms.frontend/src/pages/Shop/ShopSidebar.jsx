import React from 'react';
// Sửa đường dẫn cho đúng: thoát 1 cấp ra src/pages rồi vào Home/CategoryMenu
import CategoryMenu from '../Home/CategoryMenu';

const ShopSidebar = ({ onSelectCategory }) => {
    return (
        <div className="bg-white p-3 rounded shadow-sm border">
            <h5 className="fw-bold mb-3">Danh mục</h5>
            {/* Sửa tên component thành CategoryMenu cho khớp với import ở trên */}
            <CategoryMenu onSelect={onSelectCategory} />
            <hr />
            <h5 className="fw-bold mb-3">Khoảng giá</h5>
        </div>
    );
};
export default ShopSidebar;