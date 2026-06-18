import React from 'react';
// BỎ DẤU {} ĐỂ IMPORT DEFAULT
import { PostList } from '../blog';

const LatestBlog = () => {
    return (
        <div className="mt-5 pt-4 border-top">
            <h3 className="fw-bold mb-4">TIN TỨC & CÔNG NGHỆ</h3>
            <PostList />
        </div>
    );
};
export default LatestBlog;