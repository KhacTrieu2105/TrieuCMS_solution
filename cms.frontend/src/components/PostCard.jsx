import React from 'react';
import { Link } from 'react-router-dom';

const API_URL = "https://localhost:7186";

const PostCard = ({ post }) => {
    return (
        <div className="card h-100 border-0 shadow-sm transition-card">
            <img
                src={`${API_URL}${post.imageUrl}`}
                className="card-img-top"
                alt={post.title}
                style={{ height: "180px", objectFit: "cover" }}
            />
            <div className="card-body">
                <h6 className="card-title fw-bold">{post.title}</h6>
                <p className="card-text text-muted small">
                    {post.shortDescription?.substring(0, 60)}...
                </p>
                <Link to={`/Post/Details/${post.id}`} className="btn btn-outline-danger btn-sm w-100">
                    Đọc bài viết ➔
                </Link>
            </div>
        </div>
    );
};

export default PostCard;