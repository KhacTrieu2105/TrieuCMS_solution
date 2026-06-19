import React from 'react';
import { Link } from 'react-router-dom';

const API_URL = "https://localhost:7186";

// Dữ liệu mặc định nếu chưa truyền props.posts — thay bằng danh sách thật từ API khi có
const defaultPosts = [
    { id: 1, title: 'Hướng dẫn cài đặt React', imageUrl: null, publishedAt: null },
    { id: 2, title: 'Xu hướng công nghệ 2026', imageUrl: null, publishedAt: null },
];

const tags = [
    { label: 'Công nghệ', type: 'tech' },
    { label: 'Sữa & Dinh dưỡng', type: 'dairy' },
    { label: 'Khuyến mãi', type: 'sale' },
];

const BlogSidebar = ({ posts = defaultPosts }) => {
    return (
        <div className="blog-sidebar">
            <div className="blog-sidebar-card">
                <h5>Tin tức mới nhất</h5>
                <ul className="sidebar-post-list">
                    {posts.map((post) => (
                        <li key={post.id}>
                            <Link to={`/Post/Details/${post.id}`} className="sidebar-post-link">
                                <span className="sidebar-post-thumb">
                                    {post.imageUrl ? (
                                        <img src={`${API_URL}${post.imageUrl}`} alt={post.title} />
                                    ) : (
                                        <i className="bi bi-journal-text"></i>
                                    )}
                                </span>
                                <span className="sidebar-post-info">
                                    <span className="sidebar-post-title">{post.title}</span>
                                    {post.publishedAt && (
                                        <span className="sidebar-post-date cart-mono">
                                            {new Date(post.publishedAt).toLocaleDateString('vi-VN')}
                                        </span>
                                    )}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="blog-sidebar-card">
                <h5>Chủ đề</h5>
                <div className="sidebar-tags">
                    {tags.map((tag) => (
                        <Link key={tag.label} to="#" className={`sidebar-tag tag-${tag.type}`}>
                            {tag.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogSidebar;