import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import postService from '../services/postService';

const API_URL = "https://localhost:7186";

function PostDetail() {

    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const loadPost = async () => {
            try {
                const data = await postService.getPostById(id);
                setPost(data);
            } catch (error) {
                console.error(error);
            }
        };

        loadPost();
    }, [id]);

    if (!post) {
        return <h3 className="text-center mt-5">Đang tải...</h3>;
    }

    return (
        <div className="container mt-5">

            <h1>{post.title}</h1>

            <p className="text-muted">
                {new Date(post.createdDate).toLocaleDateString('vi-VN')}
            </p>

            {post.imageUrl && (
                <img
                    src={`${API_URL}${post.imageUrl}`}
                    alt={post.title}
                    className="img-fluid rounded mb-4"
                />
            )}

            <div className="card">
                <div className="card-body">
                    {post.content}
                </div>
            </div>

            <Link
                to="/"
                className="btn btn-secondary mt-3"
            >
                Quay lại
            </Link>

        </div>
    );
}

export default PostDetail;