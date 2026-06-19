import React from 'react';
import { Link } from 'react-router-dom';


const API_URL = "https://localhost:7186";

const PostCard = ({ post }) => {
    const { id, title, imageUrl, shortDescription, category, publishedAt } = post;

    const formattedDate = publishedAt
        ? new Date(publishedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : null;

    return (
        <div className="post-card">
            <div className="post-card-media">
                {category && <span className="post-category">{category}</span>}
                <img src={`${API_URL}${imageUrl}`} alt={title} loading="lazy" />
            </div>

            <div className="post-card-body">
                {formattedDate && (
                    <span className="post-date">
                        <i className="bi bi-calendar3 me-1"></i>{formattedDate}
                    </span>
                )}
                <h6 className="post-title" title={title}>{title}</h6>
                <p className="post-excerpt">
                    {shortDescription?.substring(0, 90)}...
                </p>
                <Link to={`/Post/Details/${id}`} className="post-link">
                    Đọc bài viết <i className="bi bi-arrow-right"></i>
                </Link>
            </div>
        </div>
    );
};

export default PostCard;