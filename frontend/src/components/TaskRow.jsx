import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getStatusColor, getTimelineColor, getIcon } from '../utils/taskUtils';
import { toast } from 'react-toastify';

const formatLocalDate = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const TaskRow = ({ groupId, task, updateTask, deleteTask }) => {
    const [localName, setLocalName] = useState(task.name || '');
    const [localNotes, setLocalNotes] = useState(task.notes || '');
    const [localStartDate, setLocalStartDate] = useState(() => {
        if (task && task.timelineStart) {
            return new Date(task.timelineStart);
        } else {
            return null;
        }
    });
    const [localEndDate, setLocalEndDate] = useState(() => {
        if (task && task.timelineEnd) {
            return new Date(task.timelineEnd);
        } else {
            return null;
        }
    });

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

    useEffect(() => {
        setLocalName(task.name || '');
        setLocalNotes(task.notes || '');
        setLocalStartDate(task.timelineStart ? new Date(task.timelineStart) : null);
        setLocalEndDate(task.timelineEnd ? new Date(task.timelineEnd) : null);
    }, [task.name, task.notes, task.timelineStart, task.timelineEnd]);

    const handleStatusChange = (newStatus) => {
        if (!isAdmin) {
            alert('Chỉ ADMIN mới có thể cập nhật trạng thái task!');
            return;
        }
        updateTask(groupId, task.id, { status: newStatus }, task)
            .catch(error => console.error('Error updating status:', error.message));
    };

    const handleDueChange = (newDate) => {
        if (!isAdmin) {
            alert('Chỉ ADMIN mới có thể cập nhật ngày hết hạn!');
            return;
        }
        if (newDate && localStartDate && newDate < localStartDate) {
            toast.warn('Ngày hết hạn không thể nhỏ hơn ngày bắt đầu timeline!');
            return;
        }
        const updatedFields = {
            dueDate: newDate ? formatLocalDate(newDate) : null,
            timelineEnd: newDate ? formatLocalDate(newDate) : null,
        };
        if (newDate && !localStartDate) {
            updatedFields.timelineStart = formatLocalDate(newDate);
            setLocalStartDate(newDate);
        }
        setLocalEndDate(newDate);
        updateTask(groupId, task.id, updatedFields, task)
            .catch(error => console.error('Error updating due date:', error.message));
    };

    const handleTimelineChange = (dates) => {
        if (!isAdmin) {
            alert('Chỉ ADMIN mới có thể cập nhật timeline!');
            return;
        }
        const [start, end] = dates;
        console.log('Timeline change:', { start, end });
        setLocalStartDate(start);
        setLocalEndDate(end);
        if (start && end) {
            console.log('Sending timeline:', {
                timelineStart: formatLocalDate(start),
                timelineEnd: formatLocalDate(end),
                dueDate: formatLocalDate(end)
            });
            updateTask(groupId, task.id, {
                timelineStart: formatLocalDate(start),
                timelineEnd: formatLocalDate(end),
                dueDate: formatLocalDate(end)
            }, task)
                .catch(error => console.error('Error updating timeline:', error.message));
        }
    };

    const handleNameChange = (newName) => {
        if (!isAdmin) {
            alert('Chỉ ADMIN mới có thể sửa tên task!');
            return;
        }
        setLocalName(newName);
    };

    const handleNameSave = () => {
        if (!isAdmin) {
            alert('Chỉ ADMIN mới có thể sửa tên task!');
            return;
        }
        if (localName.trim() !== task.name) {
            console.log('Saving name:', localName);
            updateTask(groupId, task.id, { name: localName }, task)
                .catch(error => console.error('Error updating name:', error.message));
        }
    };

    const handleNameKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleNameSave();
        }
    };

    const handleNoteChange = (newNote) => {
        if (!isAdmin) {
            alert('Chỉ ADMIN mới có thể sửa ghi chú!');
            return;
        }
        setLocalNotes(newNote);
    };

    const handleNoteSave = () => {
        if (!isAdmin) {
            alert('Chỉ ADMIN mới có thể sửa ghi chú!');
            return;
        }
        if (localNotes !== task.notes) {
            console.log('Saving note:', localNotes);
            updateTask(groupId, task.id, { notes: localNotes }, task)
                .catch(error => console.error('Error updating note:', error.message));
        }
    };

    const handleNoteKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleNoteSave();
        }
    };

    const handleDeleteTask = async () => {
        if (!isAdmin) {
            alert('Chỉ ADMIN mới có thể xóa task!');
            return;
        }
        if (!confirm('Bạn có chắc chắn muốn xóa task này?')) return;

        try {
            await deleteTask(groupId, task.id);
        } catch (error) {
            console.error('Error deleting task in TaskRow:', error.message);
        }
    };

    return (
        <tr className="bg-gray-50 hover:bg-blue-50 rounded-md transition-colors duration-200">
            <td className="px-3 py-2 align-middle">
                {task.status === 3 ? (
                    <span className="text-red-600 font-bold">X</span>
                ) : (
                    <input
                        type="checkbox"
                        checked={task.status === 2}
                        onChange={(e) => {
                            if (e.target.checked) {
                                handleStatusChange(2);
                            } else {
                                handleStatusChange(0);
                            }
                        }}
                        className="form-checkbox h-4 w-4 text-green-500"
                        disabled={!isAdmin}
                    />
                )}
            </td>
            <td className="px-3 py-2">
                <input
                    type="text"
                    value={localName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    onBlur={handleNameSave}
                    onKeyDown={handleNameKeyDown}
                    className={`w-full bg-transparent border-0 border-b border-gray-300 px-2 py-1 text-sm font-medium text-gray-800 focus:outline-none focus:ring-0 ${task.status === 3 ? 'line-through opacity-50' : ''}`}
                    placeholder="Enter task name..."
                    disabled={!isAdmin}
                />
            </td>
            <td className="px-3 py-2">
                <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(parseInt(e.target.value))}
                    className={`text-xs font-medium px-3 py-1 rounded-full text-white focus:outline-none ${getStatusColor(task.status)}`}
                    disabled={!isAdmin}
                >
                    <option className="bg-white text-black" value={0}>Todo</option>
                    <option className="bg-white text-black" value={1}>Working on it</option>
                    <option className="bg-white text-black" value={2}>Done</option>
                    <option className="bg-white text-black" value={3}>Expired</option>
                </select>
            </td>
            <td className="px-2 py-1 w-20">
                <div className="flex items-center gap-1">
                    <span className="text-gray-500 text-sm">📅</span>
                    <DatePicker
                        selected={task.dueDate ? new Date(task.dueDate) : null}
                        onChange={handleDueChange}
                        className={`text-sm bg-transparent focus:outline-none ${task.status === 2 || task.status === 3 ? 'line-through text-gray-400' : 'text-gray-700'}`}
                        dateFormat="MMM dd"
                        disabled={!isAdmin}
                    />
                </div>
            </td>
            <td className="px-2 py-1 w-32">
                <div className={`flex items-center gap-2 px-2 py-1 rounded ${getTimelineColor(task.status)}`}>
                    {getIcon(task.status)}
                    <DatePicker
                        selectsRange
                        startDate={localStartDate}
                        endDate={localEndDate}
                        onChange={handleTimelineChange}
                        className="text-sm bg-transparent text-white focus:outline-none"
                        dateFormat="MMM dd"
                        placeholderText="Timeline"
                        disabled={!isAdmin}
                    />
                </div>
            </td>
            <td className="px-3 py-2">
                {isAdmin ? (
                    <input
                        type="text"
                        value={localNotes}
                        onChange={(e) => handleNoteChange(e.target.value)}
                        onBlur={handleNoteSave}
                        onKeyDown={handleNoteKeyDown}
                        className="w-full bg-transparent border-0 border-b border-gray-300 px-2 py-1 text-sm text-gray-800 focus:outline-none focus:ring-0"
                        placeholder="Enter notes..."
                    />
                ) : (
                    <div className="w-full px-2 py-1 text-sm">
                        {localNotes?.trim()
                            ? <span className="text-gray-800">{localNotes}</span>
                            : <span className="italic text-gray-400">Chưa có ghi chú</span>}
                    </div>
                )}
            </td>
            {isAdmin && (
                <td className="px-3 py-2">
                    <button
                        onClick={handleDeleteTask}
                        className="text-red-600 hover:text-red-800"
                    >
                        <Trash2 size={16} />
                    </button>
                </td>
            )}
        </tr>
    );
};

//mobile
export const TaskCardView = ({ groupId, task, updateTask, deleteTask }) => {
    let isAdmin = false;
    try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            isAdmin = Array.isArray(user?.roles) && user.roles.some(r => r.name === 'ADMIN');
        }
    } catch (e) {
        isAdmin = false;
    }

    const [cardStatus, setCardStatus] = useState(task.status ?? 0);
    const [cardDue, setCardDue] = useState(task.dueDate ? new Date(task.dueDate) : null);
    const [cardNotes, setCardNotes] = useState(task.notes || '');
    const [localStartDate, setLocalStartDate] = useState(task.timelineStart ? new Date(task.timelineStart) : null);
    const [localEndDate, setLocalEndDate] = useState(task.timelineEnd ? new Date(task.timelineEnd) : null);

    useEffect(() => {
        setCardStatus(task.status ?? 0);
        setCardDue(task.dueDate ? new Date(task.dueDate) : null);
        setCardNotes(task.notes || '');
        setLocalStartDate(task.timelineStart ? new Date(task.timelineStart) : null);
        setLocalEndDate(task.timelineEnd ? new Date(task.timelineEnd) : null);
    }, [task.status, task.dueDate, task.notes, task.timelineStart, task.timelineEnd]);

    const handleStatusChange = async (newStatus) => {
        if (!isAdmin) { alert('Chỉ ADMIN mới có thể cập nhật trạng thái task!'); return; }
        setCardStatus(newStatus);
        try {
            await updateTask(groupId, task.id, { status: newStatus }, task);
        } catch (error) {
            console.error('Error updating status (card):', error.message);
        }
    };

    const handleDueChange = async (newDate) => {
        if (!isAdmin) {
            alert('Chỉ ADMIN mới có thể cập nhật ngày hết hạn!');
            return;
        }
        if (newDate && localStartDate && newDate < localStartDate) {
            toast.warn('Ngày hết hạn không thể nhỏ hơn ngày bắt đầu timeline!');
            return;
        }
        setCardDue(newDate);
        const updatedFields = {
            dueDate: newDate ? formatLocalDate(newDate) : null,
            timelineEnd: newDate ? formatLocalDate(newDate) : null,
        };
        if (newDate && !localStartDate) {
            updatedFields.timelineStart = formatLocalDate(newDate);
            setLocalStartDate(newDate);
        }
        setLocalEndDate(newDate);
        try {
            await updateTask(groupId, task.id, updatedFields, task);
        } catch (error) {
            console.error('Error updating due date (card):', error.message);
        }
    };

    const handleNotesSave = async () => {
        if (!isAdmin) { alert('Chỉ ADMIN mới có thể sửa ghi chú!'); return; }
        try {
            if (cardNotes !== task.notes) {
                await updateTask(groupId, task.id, { notes: cardNotes }, task);
            }
        } catch (error) {
            console.error('Error updating notes (card):', error.message);
        }
    };

    const handleTimelineChange = async (dates) => {
        if (!isAdmin) { alert('Chỉ ADMIN mới có thể cập nhật timeline!'); return; }
        const [start, end] = dates;
        setLocalStartDate(start);
        setLocalEndDate(end);
        if (start && end) {
            try {
                await updateTask(
                    groupId,
                    task.id,
                    {
                        timelineStart: formatLocalDate(start),
                        timelineEnd: formatLocalDate(end),
                        dueDate: formatLocalDate(end)
                    },
                    task
                );
            } catch (error) {
                console.error('Error updating timeline (card):', error.message);
            }
        }
    };

    const handleDelete = async () => {
        if (!isAdmin) { alert('Chỉ ADMIN mới có thể xóa task!'); return; }
        if (!window.confirm('Bạn có chắc chắn muốn xóa task này?')) return;
        try {
            await deleteTask(groupId, task.id);
        } catch (err) {
            console.error('Error deleting task (card):', err?.message || err);
        }
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <div className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium ${getTimelineColor(cardStatus)} text-white`}>
                            {getIcon(cardStatus)}
                            <span className="ml-1 hidden xs:inline">Status</span>
                        </div>
                        <div className={`font-semibold truncate ${cardStatus === 3 ? 'line-through opacity-50' : ''}`}>
                            {task?.name || 'No title'}
                        </div>
                    </div>
                </div>
                {isAdmin && (
                    <button
                        onClick={handleDelete}
                        className="text-red-600 hover:text-red-800 rounded-lg p-1"
                        title="Xóa task"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                    <div className="mb-1 text-gray-600">Status</div>
                    <select
                        value={cardStatus}
                        onChange={(e) => handleStatusChange(parseInt(e.target.value))}
                        className={`w-full text-xs font-medium px-3 py-2 rounded-full text-white focus:outline-none ${getStatusColor(cardStatus)}`}
                        disabled={!isAdmin}
                    >
                        <option className="bg-white text-black" value={0}>Todo</option>
                        <option className="bg-white text-black" value={1}>Working on it</option>
                        <option className="bg-white text-black" value={2}>Done</option>
                        <option className="bg-white text-black" value={3}>Expired</option>
                    </select>
                </div>

                <div>
                    <div className="mb-1 text-gray-600">Due</div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded border">
                        <span className="text-gray-500 text-sm">📅</span>
                        <DatePicker
                            selected={cardDue}
                            onChange={handleDueChange}
                            className={`text-sm bg-transparent focus:outline-none ${cardStatus === 2 || cardStatus === 3 ? 'line-through text-gray-400' : 'text-gray-700'}`}
                            dateFormat="MMM dd"
                            placeholderText="Select date"
                            disabled={!isAdmin}
                        />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <div className="mb-1 text-gray-600">Timeline</div>
                    <div className={`flex items-center gap-2 px-3 py-2 rounded ${getTimelineColor(cardStatus)}`}>
                        {getIcon(cardStatus)}
                        <DatePicker
                            selectsRange
                            startDate={localStartDate}
                            endDate={localEndDate}
                            onChange={handleTimelineChange}
                            className="text-sm bg-transparent text-white focus:outline-none placeholder:text-white/80"
                            dateFormat="MMM dd"
                            placeholderText="Select range"
                            disabled={!isAdmin}
                        />
                    </div>
                    <div className="mt-1 text-xs text-gray-600">
                        {localStartDate && localEndDate
                            ? `${formatLocalDate(localStartDate)} → ${formatLocalDate(localEndDate)}`
                            : 'Chưa chọn khoảng thời gian'}
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <div className="mb-1 text-gray-600">Notes</div>
                    {isAdmin ? (
                        <input
                            type="text"
                            value={cardNotes}
                            onChange={(e) => setCardNotes(e.target.value)}
                            onBlur={handleNotesSave}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleNotesSave(); } }}
                            className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter notes..."
                        />
                    ) : (
                        <div className="w-full px-1 py-2 text-sm">
                            {cardNotes?.trim()
                                ? <span className="text-gray-800">{cardNotes}</span>
                                : <span className="italic text-gray-400">Chưa có ghi chú</span>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskRow;