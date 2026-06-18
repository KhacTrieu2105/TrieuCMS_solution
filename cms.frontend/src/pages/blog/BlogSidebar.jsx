import React from 'react';
import { Link } from 'react-router-dom';

const BlogSidebar = () => {
    return (
        <div className="bg-white p-3 rounded shadow-sm border">
            <h5 className="fw-bold mb-3">Tin tức mới nhất</h5>
            {/* Bạn có thể map danh sách bài viết ở đây */}
            <ul className="list-unstyled">
                <li className="mb-2"><Link to="#" className="text-decoration-none">Hướng dẫn cài đặt React</Link></li>
                <li className="mb-2"><Link to="#" className="text-decoration-none">Xu hướng công nghệ 2026</Link></li>
            </ul>
        </div>
    );
};
export default BlogSidebar;