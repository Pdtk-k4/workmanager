import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const createTask = async (taskDTO) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/tasks`, taskDTO, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Thêm task thất bại';
        throw new Error(message);
    }
};

const updateTask = async (taskId, taskDTO) => {
    try {
        const response = await axios.put(`${BASE_URL}/api/tasks/${taskId}`, taskDTO, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Cập nhật task thất bại';
        throw new Error(message);
    }
};

const deleteTask = async (taskId) => {
    try {
        await axios.delete(`${BASE_URL}/api/tasks/${taskId}`);
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Xóa task thất bại';
        throw new Error(message);
    }
};

export default {
    createTask,
    updateTask,
    deleteTask,
};