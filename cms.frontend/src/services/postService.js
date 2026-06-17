import axiosClient from '../api/axiosClient';

const postService = {
    getAllPosts: () => {
        return axiosClient.get('/Posts');
    },

    getPostById: (id) => {
        return axiosClient.get(`/Posts/${id}`);
    }
};

export default postService;