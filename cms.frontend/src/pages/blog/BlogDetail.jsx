import React from 'react';

const API_URL = "https://localhost:7186";

const BlogDetail = ({ post }) => {
    if (!post) {
        return (
            <div className="blog-detail-loading">
                <div className="spinner"></div>
                <p>Đang tải nội dung...</p>
            </div>
        );
    }

    const { title, imageUrl, content, category, publishedAt, author } = post;
    const formattedDate = publishedAt
        ? new Date(publishedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : null;

    return (
        <article className="blog-detail">
            {category && <span className="blog-detail-category">{category}</span>}
            <h1 className="blog-detail-title">{title}</h1>

            <div className="blog-detail-meta">
                {author && (
                    <span><i className="bi bi-person"></i> {author}</span>
                )}
                {formattedDate && (
                    <span className="cart-mono"><i className="bi bi-calendar3"></i> {formattedDate}</span>
                )}
            </div>

            <div className="blog-detail-media">
                <img src={`${API_URL}${imageUrl}`} alt={title} />
            </div>

            <div className="blog-content" dangerouslySetInnerHTML={{ __html: content }} />
        </article>
    );
};

export default BlogDetail;