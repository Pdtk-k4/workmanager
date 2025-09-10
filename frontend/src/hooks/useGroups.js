import { useState, useEffect } from 'react';
import BoardService from '../services/BoardService';
import GroupService from '../services/GroupService';
import axios from 'axios';
import useTasks from './useTasks';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const useGroups = (boardId) => {
    const [groups, setGroups] = useState([]);
    const [tasks, setTasks] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const { addTask, updateTask, deleteTask, checkAndUpdateExpiredTasks, upcomingTasks } = useTasks({ tasks, setTasks });

    useEffect(() => {
        const fetchGroupsAndTasks = async () => {
            if (!boardId) {
                console.log('No boardId provided, resetting groups and tasks');
                setGroups([]);
                setTasks({});
                return;
            }
            setIsLoading(true);
            try {
                console.log(`Fetching groups for boardId: ${boardId}`);
                const groupsData = await BoardService.getGroupsByBoardId(boardId);
                console.log('Groups fetched:', groupsData);
                setGroups(groupsData);

                const tasksByGroup = {};
                for (const group of groupsData) {
                    try {
                        console.log(`Fetching tasks for groupId: ${group.id}`);
                        const response = await axios.get(`${BASE_URL}/api/groups/${group.id}/tasks`);
                        tasksByGroup[group.id] = response.data.map(task => ({
                            ...task,
                            due: task.dueDate ? new Date(task.dueDate) : new Date(),
                            timeline: task.timelineStart && task.timelineEnd ? [new Date(task.timelineStart), new Date(task.timelineEnd)] : [new Date(), new Date()],
                        }));
                    } catch (error) {
                        console.error(`Error fetching tasks for group ${group.id}:`, error.message, error.response?.data);
                        tasksByGroup[group.id] = [];
                    }
                }
                console.log('Tasks fetched:', tasksByGroup);
                setTasks(tasksByGroup);
                await checkAndUpdateExpiredTasks(tasksByGroup);
            } catch (error) {
                console.error('Error fetching groups:', error.message, error.response?.data);
                setGroups([]);
                setTasks({});
            } finally {
                setIsLoading(false);
            }
        };

        fetchGroupsAndTasks();
    }, [boardId]);

    const createGroup = async (boardId, groupName) => {
        if (!boardId || !groupName.trim()) {
            console.error('Invalid boardId or groupName:', { boardId, groupName });
            throw new Error('Invalid boardId or groupName');
        }
        try {
            console.log(`Creating group for boardId: ${boardId}, name: ${groupName}`);
            const newGroup = await GroupService.createGroup(boardId, groupName);
            console.log('New group created:', newGroup);
            setGroups(prev => [...prev, newGroup]);
            setTasks(prev => ({ ...prev, [newGroup.id]: [] }));
            return newGroup;
        } catch (error) {
            console.error('Error creating group:', error.message, error.response?.data);
            throw error;
        }
    };

    const updateGroup = async (groupId, groupName) => {
        if (!groupId || !groupName.trim()) {
            console.error('Invalid groupId or groupName:', { groupId, groupName });
            throw new Error('Invalid groupId or groupName');
        }
        try {
            console.log(`Updating groupId: ${groupId}, new name: ${groupName}`);
            await GroupService.updateGroup(groupId, groupName);
            setGroups(prev => prev.map(g => g.id === groupId ? { ...g, name: groupName } : g));
        } catch (error) {
            console.error('Error updating group:', error.message, error.response?.data);
            throw error;
        }
    };

    const deleteGroup = async (groupId) => {
        if (!groupId) {
            console.error('Invalid groupId:', groupId);
            throw new Error('Invalid groupId');
        }
        try {
            console.log(`Deleting groupId: ${groupId}`);
            await GroupService.deleteGroup(groupId);
            setGroups(prev => prev.filter(g => g.id !== groupId));
            setTasks(prev => {
                const updatedTasks = { ...prev };
                delete updatedTasks[groupId];
                return updatedTasks;
            });
        } catch (error) {
            console.error('Error deleting group:', error.message, error.response?.data);
            throw error;
        }
    };

    const refreshTasks = async (groupId) => {
        try {
            console.log(`Refreshing tasks for groupId: ${groupId}`);
            const response = await axios.get(`${BASE_URL}/api/groups/${groupId}/tasks`);
            setTasks(prev => ({
                ...prev,
                [groupId]: response.data.map(task => ({
                    ...task,
                    due: task.dueDate ? new Date(task.dueDate) : new Date(),
                    timeline: task.timelineStart && task.timelineEnd ? [new Date(task.timelineStart), new Date(task.timelineEnd)] : [new Date(), new Date()],
                })),
            }));
        } catch (error) {
            console.error(`Error refreshing tasks for group ${groupId}:`, error.message, error.response?.data);
            setTasks(prev => ({ ...prev, [groupId]: [] }));
        }
    };

    return { groups, tasks, isLoading, createGroup, updateGroup, deleteGroup, refreshTasks, setGroups, setTasks, upcomingTasks };
};

export default useGroups;