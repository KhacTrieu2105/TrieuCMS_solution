import React from 'react';
import { Link } from 'react-router-dom';

const API_URL = "https://localhost:7186";

const PostCard = ({ post }) => {
    const { id, title, imageUrl, shortDescription, category, publishedAt } = post;

    const formattedDate = publishedAt
        ? new Date(publishedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : null;

    // Hàm cắt chuỗi 30 từ (hoặc số ký tự) an toàn
    const truncateText = (text, limit) => {
        if (!text) return "";
        return text.length > limit ? text.substring(0, limit) + "..." : text;
    };

    return (
        <div className="card h-100 border-0 shadow-sm overflow-hidden rounded-4 post-card">
            <div className="position-relative overflow-hidden">
                <img
                    src={`${API_URL}${imageUrl}`}
                    alt={title}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover", transition: "transform 0.3s ease" }}
                    loading="lazy"
                />
                {category && (
                    <span className="badge bg-primary position-absolute top-0 start-0 m-3 rounded-pill px-3 py-2">
                        {category}
                    </span>
                )}
            </div>

            <div className="card-body p-4">
                {formattedDate && (
                    <div className="text-muted small mb-2">
                        <i className="bi bi-calendar3 me-1"></i> {formattedDate}
                    </div>
                )}
                <h6 className="card-title fw-bold text-truncate" title={title}>{title}</h6>
                <p className="card-text text-muted small mt-2">
                    {truncateText(shortDescription, 90)}
                </p>
                <Link to={`/Post/Details/${id}`} className="btn btn-outline-primary btn-sm rounded-pill px-4 mt-2">
                    Đọc bài viết <i className="bi bi-arrow-right ms-1"></i>
                </Link>
            </div>
        </div>
    );
};

export default PostCard;