import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

const TaskCard = ({ taskName, priority, assignee, onDelete, onEdit }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const priorityColors = {
        High: { dot: "#F19696", text: "#933838" },
        Medium: { dot: "#F1E396", text: "#A49531" },
        Low: { dot: "#D4D2C8", text: "#736F54" },
    };

    const { dot: priorityDotClass = "#D4D2C8", text: priorityTextClass = "#736F54" } = priorityColors[priority] || {};

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className="bg-white rounded-[8px] p-4 shadow-lg shadow-gray-200 mx-auto mb-4 relative" style={{ maxWidth: "90%", width: "300px" }}>
            <h3 className="text-lg font-semibold">{taskName}</h3>
            <p className="text-sm ml-2 font-bold" style={{ color: "#B2AFA3" }}>
                {assignee}
            </p>

            <div className="flex items-center mt-2 mb-2">
                <div
                    className="flex justify-center w-20 h-5 rounded-full mr-2"
                    style={{ backgroundColor: priorityDotClass }}
                >
                    <span className="text-sm font-bold" style={{ color: priorityTextClass }}>
                        {priority}
                    </span>
                </div>
            </div>

            {/* Three-Dot Icon */}
            <button
                className="absolute top-6 mr-4 right-2 text-gray-400 hover:text-gray-600"
                onClick={toggleMenu}
            >
                <FontAwesomeIcon icon={faEllipsisV} />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
                <div
                    className="absolute top-8 right-2 bg-white border border-gray-200 rounded shadow-lg"
                    style={{ zIndex: 10 }}
                >
                    <button
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                            setIsMenuOpen(false);
                            onEdit();
                        }}
                    >
                        Edit
                    </button>
                    <button
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                            setIsMenuOpen(false);
                            onDelete();
                        }}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskCard;
