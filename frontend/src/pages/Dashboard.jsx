import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import DashboardHeader from '../components/DashboardHeader';
import Sidebar from '../components/Sidebar';
import GroupTable from '../components/GroupTable';
import useGroups from '../hooks/useGroups';
import useTasks from '../hooks/useTasks';

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [user, setUser] = useState(null);
    const [selectedBoardId, setSelectedBoardId] = useState(null);
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [newGroupName, setNewGroupName] = useState('');
    const [showGroupInput, setShowGroupInput] = useState(false);
    const navigate = useNavigate();

    const { groups, tasks, isLoading, createGroup, updateGroup, deleteGroup, setTasks, upcomingTasks } = useGroups(selectedBoardId);
    const { addTask, updateTask, deleteTask } = useTasks({ tasks, setTasks });


    // Kiểm tra vai trò ADMIN
    const isAdmin = user?.roles ? user.roles.some(role => role.name === 'ADMIN') : false;

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                console.error('Lỗi khi parse dữ liệu người dùng:', error);
                localStorage.removeItem('user');
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleBoardSelect = (board) => {
        if (board) {
            setSelectedBoardId(board.id);
            setSelectedBoard(board);
            setSidebarOpen(false); // đóng sau khi chọn
        } else {
            setSelectedBoardId(null);
            setSelectedBoard(null);
            setSidebarOpen(false);
        }
    };

    const handleCreateGroup = async () => {
        if (!isAdmin) {
            alert('Chỉ ADMIN mới có thể tạo group!');
            return;
        }
        if (!newGroupName.trim() || !selectedBoardId) {
            return;
        }

        try {
            await createGroup(selectedBoardId, newGroupName.trim());
            setNewGroupName('');
            setShowGroupInput(false);
        } catch (error) {
            console.error('Error creating group in Dashboard:', error.message);
        }
    };

    if (!user) {
        return <div className="text-center mt-10 text-xl text-red-600">Đang tải...</div>;
    }


    return (
        <div className="flex min-h-screen flex-col lg:flex-row bg-gray-50">
            {/* Off-canvas for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}
            <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                     fixed inset-y-0 left-0 z-40 w-64 bg-white border-r 
                     transition-transform duration-400 ease-in-out lg:static lg:translate-x-0`}>
                <Sidebar onBoardSelect={handleBoardSelect} />
            </div>
            <div className="flex-1 p-4 lg:p-6 overflow-auto">
                <DashboardHeader user={user} setUser={setUser} boardName={selectedBoard?.name} onToggleSidebar={() => setSidebarOpen(v => !v)} upcomingTasks={upcomingTasks} />
                {isLoading ? (
                    <div className="text-center text-gray-600">Đang tải groups...</div>
                ) : selectedBoardId ? (
                    groups.length > 0 ? (
                        groups.map(group => (
                            <GroupTable
                                key={group.id}
                                group={group}
                                tasks={tasks[group.id] || []}
                                updateGroup={isAdmin ? updateGroup : () => alert('Chỉ ADMIN mới có thể sửa group!')}
                                deleteGroup={isAdmin ? deleteGroup : () => alert('Chỉ ADMIN mới có thể xóa group!')}
                                addTask={isAdmin ? addTask : () => alert('Chỉ ADMIN mới có thể thêm task!')}
                                updateTask={isAdmin ? updateTask : () => alert('Chỉ ADMIN mới có thể sửa task!')}
                                deleteTask={isAdmin ? deleteTask : () => alert('Chỉ ADMIN mới có thể xóa task!')}
                            />
                        ))
                    ) : (
                        <div className="text-center text-gray-600">Không có group nào cho board này.</div>
                    )
                ) : (
                    <div className="text-center text-gray-600">Vui lòng chọn một board từ sidebar.</div>
                )}
                {selectedBoardId && isAdmin && (
                    <div className="mt-4">
                        {showGroupInput ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                    placeholder="Tên group mới"
                                    className="border px-2 py-1 rounded-md w-64"
                                />
                                <button
                                    onClick={handleCreateGroup}
                                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                                >
                                    Tạo
                                </button>
                                <button
                                    onClick={() => setShowGroupInput(false)}
                                    className="text-gray-600 hover:text-black"
                                >
                                    Hủy
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowGroupInput(true)}
                                className="flex items-center gap-1 text-sm text-gray-600 hover:text-black"
                            >
                                <Plus size={16} /> Thêm group mới
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;