import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user?.roles?.includes('ADMIN');

    useEffect(() => {
        if (!isAdmin) {
            toast.error('Bạn không có quyền truy cập trang này');
            navigate('/dashboard');
            return;
        }
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/admin/users', {
                    auth: {
                        username: user.name,
                        password: user.password || 'password' // Lưu ý: Cần thay bằng cơ chế an toàn hơn (JWT)
                    }
                });
                setUsers(response.data);
            } catch (err) {
                setError(err.message || 'Lỗi khi lấy danh sách người dùng');
                toast.error(err.message || 'Lỗi khi lấy danh sách người dùng');
            }
        };
        fetchUsers();
    }, [navigate, isAdmin, user.name]);

    const handleAddRole = async (userId, roleName) => {
        try {
            await axios.post(`http://localhost:8080/api/admin/users/${userId}/roles`, roleName, {
                headers: { 'Content-Type': 'application/json' },
                auth: {
                    username: user.name,
                    password: user.password || 'password' // Lưu ý: Cần thay bằng cơ chế an toàn hơn
                }
            });
            setUsers(users.map(u => u.id === userId ? { ...u, roles: [...u.roles, roleName] } : u));
            toast.success(`Đã thêm role ${roleName} cho user ${userId}`);
        } catch (err) {
            setError(err.message || 'Lỗi khi thêm role');
            toast.error(err.message || 'Lỗi khi thêm role');
        }
    };

    const handleRemoveRole = async (userId, roleName) => {
        try {
            await axios.delete(`http://localhost:8080/api/admin/users/${userId}/roles/${roleName}`, {
                auth: {
                    username: user.name,
                    password: user.password || 'password' // Lưu ý: Cần thay bằng cơ chế an toàn hơn
                }
            });
            setUsers(users.map(u => u.id === userId ? { ...u, roles: u.roles.filter(r => r !== roleName) } : u));
            toast.success(`Đã xóa role ${roleName} khỏi user ${userId}`);
        } catch (err) {
            setError(err.message || 'Lỗi khi xóa role');
            toast.error(err.message || 'Lỗi khi xóa role');
        }
    };

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Quản lý người dùng</h1>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2 text-left">ID</th>
                        <th className="border p-2 text-left">Tên</th>
                        <th className="border p-2 text-left">Email</th>
                        <th className="border p-2 text-left">Roles</th>
                        <th className="border p-2 text-left">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td className="border p-2">{user.id}</td>
                            <td className="border p-2">{user.name}</td>
                            <td className="border p-2">{user.email}</td>
                            <td className="border p-2">{user.roles.join(', ')}</td>
                            <td className="border p-2">
                                <button
                                    onClick={() => handleAddRole(user.id, 'ADMIN')}
                                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                    disabled={user.roles.includes('ADMIN')}
                                >
                                    Thêm role ADMIN
                                </button>
                                <button
                                    onClick={() => handleRemoveRole(user.id, 'ADMIN')}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                    disabled={!user.roles.includes('ADMIN')}
                                >
                                    Xóa role ADMIN
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPage;