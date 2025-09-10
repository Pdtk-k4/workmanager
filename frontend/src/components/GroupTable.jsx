import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import TaskRow, { TaskCardView } from './TaskRow';
import AddTaskForm from './AddTaskForm';

const GroupTable = ({ group, tasks, updateGroup, deleteGroup, addTask, updateTask, deleteTask }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [groupName, setGroupName] = useState(group.name);
    const [newTaskNameMobile, setNewTaskNameMobile] = useState('');

    let isAdmin = false;
    const userStr = localStorage.getItem('user');
    if (userStr !== null) {
        try {
            const user = JSON.parse(userStr);
            if (user && Array.isArray(user.roles)) {
                const hasAdminRole = user.roles.some((role) => role.name === 'ADMIN');
                isAdmin = !!hasAdminRole;
            } else {
                isAdmin = false;
            }
        } catch (error) {
            isAdmin = false;
        }
    } else {
        isAdmin = false;
    }

    const handleEditGroup = async () => {
        if (!isAdmin) {
            alert('Chỉ ADMIN mới có thể sửa tên group!');
            return;
        }
        if (!groupName.trim()) {
            alert('Tên group không được để trống!');
            return;
        }
        try {
            await updateGroup(group.id, groupName);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating group in GroupTable:', error.message);
            alert('Không thể cập nhật group: ' + error.message);
        }
    };

    const handleDeleteGroup = async () => {
        if (!isAdmin) {
            alert('Chỉ ADMIN mới có thể xóa group!');
            return;
        }
        if (!window.confirm('Bạn có chắc chắn muốn xóa group này?')) return;
        try {
            await deleteGroup(group.id);
        } catch (error) {
            console.error('Error deleting group in GroupTable:', error.message);
            alert('Không thể xóa group: ' + error.message);
        }
    };

    // Thêm task nhanh ở mobile
    const handleAddTaskMobile = async () => {
        if (!isAdmin) {
            alert('Chỉ ADMIN mới có thể thêm task!');
            return;
        }
        if (!newTaskNameMobile.trim()) {
            alert('Tên task không được để trống!');
            return;
        }
        try {
            await addTask(group.id, newTaskNameMobile.trim());
            setNewTaskNameMobile('');
        } catch (error) {
            console.error('Error adding task (mobile):', error.message);
            alert('Không thể thêm task: ' + error.message);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md mb-4">
            {/* Header group */}
            <div className="flex justify-between items-center mb-4">
                {isEditing && isAdmin ? (
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="border rounded px-2 py-1"
                        />
                        <button
                            onClick={handleEditGroup}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                            Lưu
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400"
                        >
                            Hủy
                        </button>
                    </div>
                ) : (
                    <>
                        <h3 className="font-semibold text-blue-600 text-lg">{group.name}</h3>
                        {isAdmin && (
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-blue-500 hover:text-blue-700"
                                    title="Sửa tên group"
                                >
                                    <Edit2 size={20} />
                                </button>
                                <button
                                    onClick={handleDeleteGroup}
                                    className="text-red-500 hover:text-red-700"
                                    title="Xóa group"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Mobile < md */}
            <div className="md:hidden space-y-3">
                {tasks.map((task) => (
                    <TaskCardView
                        key={task.id}
                        groupId={group.id}
                        task={task}
                        updateTask={updateTask}
                        deleteTask={deleteTask}
                    />
                ))}

                {isAdmin && (
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="+ Add task"
                            value={newTaskNameMobile}
                            onChange={(e) => setNewTaskNameMobile(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddTaskMobile(); }}
                            className="w-full px-3 py-2 rounded-md bg-white border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleAddTaskMobile}
                            className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
                        >
                            Thêm
                        </button>
                    </div>
                )}
            </div>

            {/* Desktop ≥ md */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left border-separate border-spacing-y-2">
                    <thead>
                        <tr className="text-gray-600">
                            <th className="px-3 py-2">✓</th>
                            <th className="px-3 py-2">Task</th>
                            <th className="px-3 py-2">Status</th>
                            <th className="px-3 py-2">Due date</th>
                            <th className="px-3 py-2">Timeline</th>
                            <th className="px-3 py-2">Notes</th>
                            {isAdmin && <th className="px-3 py-2">Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task => (
                            <TaskRow
                                key={task.id}
                                groupId={group.id}
                                task={task}
                                updateTask={updateTask}
                                deleteTask={deleteTask}
                            />
                        ))}
                        {isAdmin && <AddTaskForm groupId={group.id} addTask={addTask} />}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GroupTable;