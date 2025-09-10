import { User, Menu as MenuIcon, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DashboardHeader = ({ user, setUser, boardName, onToggleSidebar = () => { }, upcomingTasks = [] }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        toast.success('Đăng xuất thành công!');
        navigate('/login', { replace: true });
    };

    const handleNotificationClick = () => {
        if (upcomingTasks.length === 0) {
            alert('Không có task nào sắp hết hạn!');
            return;
        }
        const taskList = upcomingTasks.map(({ task }) => `Task: ${task.name} (Due: ${task.dueDate})`).join('\n');
        alert(`Các task sắp hết hạn:\n${taskList}`);
    };

    return (
        <div className="flex justify-between items-center mb-6">
            <button onClick={onToggleSidebar} className="lg:hidden p-1 border border-gray-700 rounded-lg" aria-label="Toggle sidebar" type="button">
                <MenuIcon className="w-5 h-5" />
            </button>
            <div>
                <h1 className="text-lg font-semibold">{boardName || 'Work Manager'}</h1>
                <p className="hidden lg:block text-sm text-gray-600">Welcome, {user?.name || 'Guest'}</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <button
                        onClick={handleNotificationClick}
                        className="text-gray-600 hover:text-gray-800 relative"
                        title="Thông báo"
                    >
                        <Bell className="w-6 h-6" />
                        {upcomingTasks.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                {upcomingTasks.length}
                            </span>
                        )}
                    </button>
                </div>
                <User className="w-6 h-6" />
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default DashboardHeader;