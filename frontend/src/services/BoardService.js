// DOCUMENT filename="BoardService.js"
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getBoards = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/boards`);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Lỗi khi lấy danh sách boards';
        throw new Error(message);
    }
};

const addBoard = async (workspace, boardName) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/boards`, {
            name: boardName,
            description: "", // Có thể thêm workspace nếu backend hỗ trợ
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Thêm bảng thất bại';
        throw new Error(message);
    }
};

const updateBoard = async (workspace, oldBoardName, newBoardName) => {
    try {
        const response = await axios.put(`${BASE_URL}/api/boards`, { workspace, oldBoardName, newBoardName }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Cập nhật bảng thất bại';
        throw new Error(message);
    }
};

const deleteBoard = async (boardId) => {
    try {
        await axios.delete(`${BASE_URL}/api/boards/${boardId}`);
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Xóa board thất bại';
        throw new Error(message);
    }
};

const getGroupsByBoardId = async (boardId) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/boards/${boardId}/groups`);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Lỗi khi lấy danh sách groups';
        throw new Error(message);
    }
};

export default {
    getBoards,
    addBoard,
    updateBoard,
    deleteBoard,
    getGroupsByBoardId,
};