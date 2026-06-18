import React from 'react';

const ShopHeader = ({ count }) => {
    return (
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold">Cửa hàng</h3>
            <span className="text-muted">Hiển thị {count} sản phẩm</span>
        </div>
    );
};
export default ShopHeader;