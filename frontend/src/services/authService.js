import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const login = async (credentials) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, credentials, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.message || error.message || 'Đăng nhập thất bại';
        throw new Error(message);
    }
};

const register = async (credentials) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/register`, credentials, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.message || error.message || 'Đăng ký thất bại';
        throw new Error(message);
    };
}

const updateProfile = async (id, data) => {
    try {
        const response = await axios.put(`${BASE_URL}/api/auth/update-profile/${id}`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.message || error.message || 'Cập nhật hồ sơ thất bại';
        throw new Error(message);
    }
};

export default { login, register };