import React from 'react';

const LoadingOrEmpty = ({ isLoading, isEmpty }) => {
    if (isLoading) return <div className="text-center p-5">Đang tải sản phẩm...</div>;
    if (isEmpty) return <div className="text-center p-5 text-muted">Không tìm thấy sản phẩm nào.</div>;
    return null;
};
export default LoadingOrEmpty;