import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import postService from '../../services/postService';
import BlogDetail from './BlogDetail';
import BlogSidebar from './BlogSidebar';

const API_URL = "https://localhost:7186";

// 1. Component danh sách bài viết (PostList)
export const PostList = () => {
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
                    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden" style={{ transition: '0.3s' }}>
                        <div style={{ height: "200px", overflow: 'hidden' }}>
                            <img
                                src={`${API_URL}${post.imageUrl}`}
                                className="card-img-top h-100"
                                alt={post.title}
                                style={{ objectFit: "cover", transition: '0.5s' }}
                                onMouseOver={e => e.target.style.transform = "scale(1.08)"}
                                onMouseOut={e => e.target.style.transform = "scale(1)"}
                            />
                        </div>
                        <div className="card-body p-4">
                            <span className="badge bg-light text-primary mb-2">Công nghệ</span>
                            <h5 className="card-title fw-bold text-truncate">{post.title}</h5>
                            <p className="card-text text-muted small lh-lg" style={{ height: "60px", overflow: 'hidden' }}>
                                {post.shortDescription?.substring(0, 80)}...
                            </p>
                            <Link
                                to={`/Post/Details/${post.id}`}
                                className="btn btn-outline-primary btn-sm w-100 mt-3 rounded-pill"
                            >
                                Đọc chi tiết
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// 2. Component chính của trang chi tiết (BlogPage)
const BlogPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const data = await postService.getPostById(id);
                setPost(data);
            } catch (error) {
                console.error("Lỗi khi tải bài viết:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) return (
        <div className="d-flex justify-content-center p-5">
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );

    return (
        <div className="container py-5">
            <div className="row g-5">
                {/* Nội dung bài viết */}
                <div className="col-lg-8">
                    <div className="bg-white p-4 p-md-5 shadow-sm rounded-4 border">
                        <BlogDetail post={post} />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="col-lg-4">
                    <div className="sticky-top" style={{ top: '100px' }}>
                        <BlogSidebar />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPage;