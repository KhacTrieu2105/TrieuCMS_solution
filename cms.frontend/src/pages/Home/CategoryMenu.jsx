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

    // 2. Giao diện hiển thị (Dạng nằm ngang)
    return (
        <div className="category-menu-wrapper mb-4">
            <div className="d-flex align-items-center mb-3">
                <h5 className="mb-0 text-uppercase text-primary font-weight-bold">
                    <i className="fa-solid fa-cubes me-2"></i> Danh mục sản phẩm
                </h5>
            </div>

            <div className="d-flex flex-wrap gap-2">
                {/* Nút tất cả */}
                <button
                    type="button"
                    className={`btn px-4 py-2 rounded-pill ${selectedId === null
                            ? 'btn-primary shadow-sm'
                            : 'btn-outline-secondary'
                        }`}
                    onClick={() => handleSelect(null)}
                >
                    Tất cả
                </button>

                {/* Danh sách danh mục */}
                {loading ? (
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                ) : (
                    categoryProducts.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            className={`btn px-4 py-2 rounded-pill ${selectedId === item.id
                                    ? 'btn-primary shadow-sm'
                                    : 'btn-outline-secondary'
                                }`}
                            onClick={() => handleSelect(item.id)}
                        >
                            {item.name}
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};

export default CategoryMenu;