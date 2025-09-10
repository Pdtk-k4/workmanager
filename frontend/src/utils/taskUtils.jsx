export const getStatusColor = (status) => {
    switch (status) {
        case 2: return "bg-green-500"; // Done
        case 1: return "bg-yellow-500"; // Working on it
        case 0: return "bg-gray-500"; // Todo
        case 3: return "bg-red-500"; // Expired
        default: return "bg-gray-400";
    }
};

export const getTimelineColor = (status) => {
    switch (status) {
        case 2: return "bg-green-600"; // Done
        case 1: return "bg-blue-500"; // Working on it
        case 0: return "bg-gray-600"; // Todo
        case 3: return "bg-red-700"; // Expired
        default: return "bg-gray-400";
    }
};

export const getIcon = (status) => {
    switch (status) {
        case 2: return <span className="text-white text-sm">✔</span>; // Done
        case 1: return <span className="text-white text-sm">⏳</span>; // Working on it
        case 3: return <span className="text-white text-sm">⚠</span>; // Expired
        case 0: return <span className="text-white text-sm">📌</span>; // Todo
        default: return null;
    }
};