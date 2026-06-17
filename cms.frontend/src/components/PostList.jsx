import React, { useEffect, useState } from 'react';
import postService from '../services/postService';
import { Link } from 'react-router-dom';

const API_URL = "https://localhost:7186";

const PostList = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await postService.getAllPosts();
                setPosts(data || []);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="row g-4">
            {posts.map(post => (
                <div key={post.id} className="col-md-4">
                    {/* Bỏ border-0 nếu muốn shadow nhẹ, hoặc giữ border-0 để phẳng hoàn toàn như ảnh */}
                    <div className="card h-100 border-0">
                        <img
                            src={`${API_URL}${post.imageUrl}`}
                            className="card-img-top"
                            alt={post.title}
                            style={{ height: "200px", objectFit: "cover" }}
                        />
                        <div className="card-body px-0">
                            <h5 className="card-title fw-bold">{post.title}</h5>
                            <p className="card-text text-muted small">
                                {post.shortDescription?.substring(0, 80)}...
                            </p>
                            <Link
                                to={`/Post/Details/${post.id}`}
                                className="btn btn-outline-danger btn-sm w-100 mt-2"
                                style={{ borderRadius: '4px' }}
                            >
                                Đọc bài viết ➔
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PostList;