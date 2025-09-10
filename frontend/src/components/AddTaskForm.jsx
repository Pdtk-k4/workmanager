import { useState } from 'react';
import { Plus } from 'lucide-react';

const AddTaskForm = ({ groupId, addTask }) => {
    const [newTaskName, setNewTaskName] = useState('');

    const handleAddTask = async () => {
        if (!newTaskName.trim()) {
            return;
        }

        try {
            await addTask(groupId, newTaskName);
            setNewTaskName('');
        } catch (error) {
            console.error('Error adding task in AddTaskForm:', error.message);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && newTaskName.trim() !== '') {
            handleAddTask();
        }
    };

    return (
        <tr className="bg-blue-50 hover:bg-blue-100 rounded-md transition">
            <td className="px-3 py-2">
                <Plus className="w-4 h-4 text-gray-400" />
            </td>
            <td colSpan={6} className="px-3 py-2">
                <input
                    type="text"
                    placeholder="+ Add task"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-3 py-2 rounded-md bg-white border border-blue-300 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            </td>
        </tr>
    );
};

export default AddTaskForm;