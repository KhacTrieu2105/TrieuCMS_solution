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

    if (loading) return <div className="text-center p-5">Đang tải bài viết...</div>;

    return (
        <div className="container py-4">
            <div className="row g-4">
                <div className="col-lg-8">
                    <BlogDetail post={post} />
                </div>
                <div className="col-lg-4">
                    <BlogSidebar />
                </div>
            </div>
        </div>
    );
};

export default BlogPage;