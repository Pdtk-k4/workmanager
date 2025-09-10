import { Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import BoardService from '../services/BoardService';

const workspaces = ['Main workspace', 'Marketing', 'Design', 'Development'];

export default function Sidebar({ onBoardSelect }) {
    const [selected, setSelected] = useState(workspaces[0]);
    const [selectedBoardId, setSelectedBoardId] = useState(null);
    const [boards, setBoards] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newBoardName, setNewBoardName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const isAdmin = JSON.parse(localStorage.getItem('user'))?.roles?.some(role => role.name === 'ADMIN') ?? false;

    useEffect(() => {
        const fetchBoards = async () => {
            setIsLoading(true);
            try {
                const boardsFromServer = await BoardService.getBoards(selected);
                setBoards(boardsFromServer);
                if (boardsFromServer.length > 0 && !selectedBoardId) {
                    setSelectedBoardId(boardsFromServer[0].id);
                    onBoardSelect(boardsFromServer[0]);
                } else if (boardsFromServer.length === 0) {
                    setSelectedBoardId(null);
                    onBoardSelect(null);
                }
            } catch (error) {
                console.error('Lỗi khi tải boards:', error.message);
                toast.error('Không thể tải boards: ' + error.message);
                setBoards([]);
                setSelectedBoardId(null);
                onBoardSelect(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBoards();
    }, [selected, onBoardSelect]);

    const handleCreateBoard = async () => {
        if (!isAdmin) {
            toast.warn('Chỉ ADMIN mới có thể tạo board!');
            return;
        }
        if (!newBoardName.trim()) {
            toast.warn('Vui lòng nhập tên board');
            return;
        }

        try {
            const created = await BoardService.addBoard(selected, newBoardName.trim());
            setBoards([...boards, created]);
            setNewBoardName('');
            setIsCreating(false);
            setSelectedBoardId(created.id);
            onBoardSelect(created);
            toast.success('Tạo board thành công!');
        } catch (error) {
            console.error('Tạo board thất bại:', error.message);
            toast.error('Không thể tạo board: ' + error.message);
        }
    };

    const handleDeleteBoard = async (boardId) => {
        if (!isAdmin) {
            toast.warn('Chỉ ADMIN mới có thể xóa board!');
            return;
        }
        try {
            await BoardService.deleteBoard(boardId);
            const updatedBoards = boards.filter((b) => b.id !== boardId);
            setBoards(updatedBoards);
            if (selectedBoardId === boardId) {
                const firstBoard = updatedBoards[0];
                setSelectedBoardId(firstBoard?.id || null);
                onBoardSelect(firstBoard || null);
            }
            toast.success('Xóa board thành công!');
        } catch (error) {
            console.error('Xóa board thất bại:', error.message);
            toast.error('Không thể xóa board: ' + error.message);
        }
    };

    const handleBoardClick = (boardId) => {
        const board = boards.find((b) => b.id === boardId);
        setSelectedBoardId(boardId);
        onBoardSelect(board);
    };

    return (
        <div className="w-64 h-screen border-r border-gray-200 bg-white p-4 flex flex-col">

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-bold shadow">
                        {selected[0]}
                    </div>
                    <div className="relative">
                        <select
                            value={selected}
                            onChange={(e) => {
                                setSelected(e.target.value);
                                setSelectedBoardId(null);
                                onBoardSelect(null);
                            }}
                            className="appearance-none bg-gray-100 text-sm font-medium text-gray-900 px-3 py-2 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-200 transition duration-150"
                        >
                            {workspaces.map((workspace) => (
                                <option key={workspace} value={workspace}>
                                    {workspace}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-gray-500">
                            ▼
                        </div>
                    </div>
                </div>
                {isAdmin && (
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow"
                        onClick={() => setIsCreating(true)}
                    >
                        <Plus size={16} />
                    </button>
                )}
            </div>

            {/* Input tạo board mới */}
            {isCreating && isAdmin && (
                <div className="flex items-center gap-2 mb-4">
                    <input
                        type="text"
                        value={newBoardName}
                        onChange={(e) => setNewBoardName(e.target.value)}
                        placeholder="Nhập tên board..."
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateBoard()}
                    />
                    <button
                        onClick={handleCreateBoard}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                        Tạo
                    </button>
                </div>
            )}

            {/* Danh sách board */}
            {isLoading ? (
                <div className="text-center text-gray-600">Đang tải boards...</div>
            ) : (
                <div className="flex flex-col gap-2">
                    {boards.map((board) => (
                        <div
                            key={board.id}
                            className={`group px-2 py-1 rounded hover:bg-gray-100 text-sm text-gray-800 cursor-pointer flex justify-between items-center ${selectedBoardId === board.id ? 'bg-blue-100' : ''}`}
                            onClick={() => handleBoardClick(board.id)}
                        >
                            <span>{board.name}</span>
                            {isAdmin && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteBoard(board.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs transition"
                                    title="Xóa board"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}