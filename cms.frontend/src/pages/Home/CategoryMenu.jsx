import React, { useState, useEffect } from 'react';
import categoryProductService from '../../services/categoryProductService';

const CategoryMenu = ({ onSelect }) => {
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);

    // 1. Logic lấy dữ liệu
    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                setLoading(true);
                const data = await categoryProductService.getAllCategoryProducts();
                setCategoryProducts(data || []);
            } catch (error) {
                console.error("Lỗi khi tải danh mục sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategoryProducts();
    }, []);

    const handleSelect = (id) => {
        setSelectedId(id);
        if (onSelect) {
            onSelect(id);
        }
    };

    // 2. Giao diện hiển thị
    return (
        <div className="card shadow-sm border-0 rounded-lg mb-4">
            <div className="card-header bg-primary text-white pt-3 pb-2 px-4 border-0">
                <h5 className="card-title text-uppercase font-weight-bold d-flex align-items-center mb-0" style={{ fontSize: '1.1rem' }}>
                    <i className="fa-solid fa-cubes mr-2"></i> DANH MỤC SP
                </h5>
            </div>

            <div className="card-body p-0">
                <div className="list-group list-group-flush">
                    {/* Nút tất cả */}
                    <button
                        type="button"
                        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center px-4 py-3 ${selectedId === null ? 'bg-light font-weight-bold text-primary' : ''}`}
                        onClick={() => handleSelect(null)}
                    >
                        <span>Tất cả sản phẩm</span>
                        <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.8rem' }}></i>
                    </button>

                    {loading ? (
                        <div className="p-3 text-center">Đang tải...</div>
                    ) : (
                        categoryProducts.map((item) => (
                            <button
                                type="button"
                                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center px-4 py-3 border-0 ${selectedId === item.id ? 'active' : ''}`}
                                style={{ transition: '0.3s', backgroundColor: selectedId === item.id ? '#0d6efd' : 'transparent' }}
                                onClick={() => handleSelect(item.id)}
                            >
                                <span className="fw-medium">{item.name}</span>
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryMenu;