import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getAllGroups = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/groups`);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Lỗi khi lấy danh sách groups';
        throw new Error(message);
    }
};

const getTasksByGroupId = async (groupId) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/groups/${groupId}/tasks`);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || `Lỗi khi lấy tasks cho group ${groupId}`;
        throw new Error(message);
    }
};

const createGroup = async (boardId, groupName) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/groups`, {
            boardId,
            name: groupName,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Thêm group thất bại';
        throw new Error(message);
    }
};

const updateGroup = async (groupId, groupName) => {
    try {
        const response = await axios.put(`${BASE_URL}/api/groups/${groupId}`, {
            name: groupName,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Cập nhật group thất bại';
        throw new Error(message);
    }
};

const deleteGroup = async (groupId) => {
    try {
        await axios.delete(`${BASE_URL}/api/groups/${groupId}`);
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Xóa group thất bại';
        throw new Error(message);
    }
};

export default {
    getAllGroups,
    getTasksByGroupId,
    createGroup,
    updateGroup,
    deleteGroup,
};