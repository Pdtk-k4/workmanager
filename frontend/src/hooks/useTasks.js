import { useEffect, useState } from 'react';
import TaskService from '../services/TaskService';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const useTasks = ({ tasks, setTasks }) => {
    const [upcomingTasks, setUpcomingTasks] = useState([]);

    const addTask = async (groupId, taskName) => {
        if (!groupId || !taskName.trim()) {
            console.error('Invalid groupId or taskName:', { groupId, taskName });
            throw new Error('Invalid groupId or taskName');
        }
        try {
            console.log(`Creating task for groupId: ${groupId}, name: ${taskName}`);
            const taskDTO = {
                groupId: Number(groupId),
                name: taskName.trim(),
                status: 0,
                dueDate: new Date().toISOString().split('T')[0],
                timelineStart: new Date().toISOString().split('T')[0],
                timelineEnd: new Date().toISOString().split('T')[0],
                notes: '',
            };
            await TaskService.createTask(taskDTO);
            const tasksResponse = await axios.get(`${BASE_URL}/api/groups/${groupId}/tasks`);
            setTasks(prev => ({
                ...prev,
                [groupId]: tasksResponse.data.map(task => ({
                    ...task,
                    due: task.dueDate ? new Date(task.dueDate) : new Date(),
                    timeline: task.timelineStart && task.timelineEnd ? [new Date(task.timelineStart), new Date(task.timelineEnd)] : [new Date(), new Date()],
                })),
            }));
        } catch (error) {
            console.error('Error adding task:', error.message, error.response?.data);
            throw error;
        }
    };

    const updateTask = async (groupId, taskId, updatedFields, currentTask) => {
        if (!groupId || !taskId) {
            console.error('Invalid groupId or taskId:', { groupId, taskId });
            throw new Error('Invalid groupId or taskId');
        }
        try {
            console.log(`Updating task ${taskId} with fields:`, updatedFields);
            const taskDTO = {
                id: taskId,
                groupId: Number(groupId),
                name: currentTask.name,
                status: currentTask.status,
                dueDate: currentTask.dueDate ? new Date(currentTask.dueDate).toISOString().split('T')[0] : null,
                timelineStart: currentTask.timelineStart ? new Date(currentTask.timelineStart).toISOString().split('T')[0] : null,
                timelineEnd: currentTask.timelineEnd ? new Date(currentTask.timelineEnd).toISOString().split('T')[0] : null,
                notes: currentTask.notes || '',
                ...updatedFields,
            };
            console.log('Sending taskDTO:', taskDTO);
            await TaskService.updateTask(taskId, taskDTO);
            const tasksResponse = await axios.get(`${BASE_URL}/api/groups/${groupId}/tasks`);
            setTasks(prev => ({
                ...prev,
                [groupId]: tasksResponse.data.map(task => ({
                    ...task,
                    due: task.dueDate ? new Date(task.dueDate) : new Date(),
                    timeline: task.timelineStart && task.timelineEnd ? [new Date(task.timelineStart), new Date(task.timelineEnd)] : [new Date(), new Date()],
                })),
            }));
        } catch (error) {
            console.error('Error updating task:', error.message, error.response?.data);
            throw error;
        }
    };

    const deleteTask = async (groupId, taskId) => {
        if (!groupId || !taskId) {
            console.error('Invalid groupId or taskId:', { groupId, taskId });
            throw new Error('Invalid groupId or taskId');
        }
        try {
            console.log(`Deleting task ${taskId} from group ${groupId}`);
            await TaskService.deleteTask(taskId);
            const tasksResponse = await axios.get(`${BASE_URL}/api/groups/${groupId}/tasks`);
            setTasks(prev => ({
                ...prev,
                [groupId]: tasksResponse.data.map(task => ({
                    ...task,
                    due: task.dueDate ? new Date(task.dueDate) : new Date(),
                    timeline: task.timelineStart && task.timelineEnd ? [new Date(task.timelineStart), new Date(task.timelineEnd)] : [new Date(), new Date()],
                })),
            }));
        } catch (error) {
            console.error('Error deleting task:', error.message, error.response?.data);
            throw error;
        }
    };

    const checkAndUpdateExpiredTasks = async (tasks) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Đặt về đầu ngày để so sánh

        for (const groupId in tasks) {
            const groupTasks = tasks[groupId];
            for (const task of groupTasks) {
                if (task.status === 2 || task.status === 3) continue; // Bỏ qua task đã Done hoặc Expired

                const dueDate = task.dueDate ? new Date(task.dueDate) : null;
                if (dueDate && dueDate < today) {
                    try {
                        console.log(`Task ${task.id} in group ${groupId} has expired. Updating status to Expired.`);
                        await updateTask(groupId, task.id, { status: 3 }, task);
                    } catch (error) {
                        console.error(`Error updating task ${task.id} to Expired:`, error.message);
                    }
                }
            }
        }
    };

    const checkUpcomingTasks = (tasks) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const upcoming = [];
        for (const groupId in tasks) {
            const groupTasks = tasks[groupId];
            for (const task of groupTasks) {
                if (task.status === 2 || task.status === 3) continue; // Bỏ qua task Done hoặc Expired

                const dueDate = task.dueDate ? new Date(task.dueDate) : null;
                if (dueDate && dueDate.getTime() === tomorrow.getTime()) {
                    upcoming.push({ groupId, task });
                }
            }
        }
        return upcoming;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setTasks(prev => {
                checkAndUpdateExpiredTasks(prev);
                const upcoming = checkUpcomingTasks(prev);
                setUpcomingTasks(upcoming);
                if (upcoming.length > 0) {
                    toast.warn(`Có ${upcoming.length} task sắp hết hạn trong vòng 1 ngày!`, {
                        position: "top-right",
                        autoClose: 5000,
                    });
                }
                return prev;
            });
        }, 24 * 60 * 60 * 1000); // Kiểm tra mỗi 24 giờ

        // Kiểm tra ngay khi component mount
        setTasks(prev => {
            const upcoming = checkUpcomingTasks(prev);
            setUpcomingTasks(upcoming);
            if (upcoming.length > 0) {
                toast.warn(`Có ${upcoming.length} task sắp hết hạn trong vòng 1 ngày!`, {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
            return prev;
        });

        return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
    }, [setTasks]);

    return { addTask, updateTask, deleteTask, checkAndUpdateExpiredTasks, upcomingTasks };
};

export default useTasks;