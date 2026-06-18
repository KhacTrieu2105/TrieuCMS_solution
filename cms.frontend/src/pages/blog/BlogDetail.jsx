import React from 'react';

const API_URL = "https://localhost:7186";

const BlogDetail = ({ post }) => {
    if (!post) return <p>Đang tải nội dung...</p>;

    return (
        <div className="bg-white p-4 rounded shadow-sm border">
            <h1 className="fw-bold mb-3">{post.title}</h1>
            <img
                src={`${API_URL}${post.imageUrl}`}
                alt={post.title}
                className="img-fluid rounded mb-4"
            />
            <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
    );
};
export default BlogDetail;