"use client"

import React, { useState, useEffect, useRef } from 'react';
import TaskCard from './TaskCard';
import { fetchUserTasks, addTaskToUser, deleteTaskFromUser } from '@/app/api/tasks/route';
import { useUser } from "@auth0/nextjs-auth0/client";
import io from 'socket.io-client'

const TaskInputArea = ({ title, color }) => {
    const { user, error, isLoading } = useUser();  // Using the useUser hook from Auth0
    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState("");
    const [priority, setPriority] = useState("");
    const [assignee, setAssignee] = useState("");
    const [status, setStatus] = useState(title)
    const [showModal, setShowModal] = useState(false);

    const socketRef = useRef(null); //avoid rerender, the connection doesn't need to be re established

    if (!socketRef.current) {
        socketRef.current = io("http://localhost:5000")
    }
    const socket = socketRef.current;

    useEffect(() => {
        if (user) {

            const loadTasks = async () => {
                try {
                    const userTasks = await fetchUserTasks(user.sub);  // Using the user.sub as the user ID
                    setTasks(userTasks);
                } catch (error) {
                    console.error("Error fetching tasks:", error);
                }
            };
            loadTasks();

            // Event listeners
            const handleTaskAdded = (newTask) => {
                console.log("Task added event received:", newTask);

                if (newTask && newTask.name && newTask.priority && newTask.status) {
                    console.log("New task is valid:", newTask);
                    setTasks((prevTasks) => {
                        if (!prevTasks.find(task => task._id === newTask._id)) {
                            return [...prevTasks, newTask];
                        }
                        return prevTasks
                    });
                } else {
                    console.error("Received invalid task data:", newTask);
                }
            };

            const handleTaskDeleted = (taskId) => {
                console.log("Task deleted event received:", taskId);

                setTasks((prevTasks) => prevTasks.filter(task => task._id !== taskId));
            }

            socket.on('task_added', handleTaskAdded);
            socket.on('task_deleted', handleTaskDeleted);

            return () => {
                socket.off("task_added", handleTaskAdded)
                socket.off("task_deleted", handleTaskDeleted);
            }
        }
    }, [user, socket]);  // This effect runs when the user object is available

    const deleteTask = async (taskId) => {
        if (!taskId) {
            console.error("Task ID is undefined");
            return;
        }
        try {
            await deleteTaskFromUser(user.sub, taskId);  // Pass user.sub as userId
            setTasks(tasks.filter(task => task._id !== taskId));

            socket.emit('task_deleted', taskId); // Remove the task from the UI
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const editTask = async (taskId) => {
        try {
            console.log('Edit task')
        } catch (error) {
            console.error("Error editing task:", error)
        }
    }

    const addTask = async () => {
        if (taskName && status && priority && assignee) {
            try {
                const newTask = {
                    name: taskName,
                    priority,
                    status,
                    assignee
                };
                const addedTask = await addTaskToUser(user.sub, newTask);
                console.log('test added task')
                console.log(addedTask) // Pass user.sub as userId
                // setTasks([...tasks, addedTask]);  // Add the new task to the task list
                // Reset the input fields
                socket.emit('task_added', addedTask)
                setTaskName("");
                setPriority("");
                setAssignee("");
                setShowModal(false);
            } catch (error) {
                console.error("Error adding task:", error);
            }
        }
    };

    const closeModal = () => {
        setTaskName("");
        setPriority("");
        setAssignee("");
        setShowModal(false);
    };

    if (isLoading) return <div>Loading...</div>;  // Handle loading state if needed
    if (error) return <div>Error: {error.message}</div>;  // Handle error state if needed

    return (
        <div>
            <div className="bg-[#F8F7F5] rounded-[10px] w-full h-[40px] sm:h-[50px] md:h-[60px] lg:h-[80px] mb-4 flex items-center px-4">
                <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: color }}></div>
                <h2 className='ml-4 text-lg font-bold flex-grow'>{title}</h2>
                <span className='ml-4 text-xl' style={{ color: "#BFAFAF" }}>{tasks.filter(task => task.status === title).length}</span>
            </div>

            <div className="bg-[#F8F7F5] rounded-[10px] w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-y-auto relative">
                <div className='flex flex-col pt-4 items-center gap-0.5'>
                    {tasks.filter(task => task.status === title).map((task, index) => (

                        <TaskCard
                            key={task._id}
                            taskName={task.name}
                            priority={task.priority}
                            assignee={task.assignee}
                            onDelete={() => deleteTask(task._id)}
                            onEdit={() => editTask(task._id)}  // Pass task._id to delete
                        />
                    ))}
                </div>

                <div className="absolute bottom-4 ml-12 transform -translate-x-1/2">
                    <button
                        className="bg-[#F8F7F5] text-[#948D77] font-bold rounded px-4 py-2"
                        onClick={() => setShowModal(true)}
                    >
                        + Item
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-[10px] p-6 w-11/12 max-w-md shadow-lg relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={closeModal}
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold mb-4">Add Task</h2>
                        <input
                            className="border border-gray-300 rounded p-2 w-full mb-2"
                            placeholder="Task Name"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                        />
                        <input
                            className="border border-gray-300 rounded p-2 w-full mb-2"
                            placeholder="Priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        />
                        <input
                            className="border border-gray-300 rounded p-2 w-full mb-4"
                            placeholder="Assignee"
                            value={assignee}
                            onChange={(e) => setAssignee(e.target.value)}
                        />
                        <input
                            className="border border-gray-300 rounded p-2 w-full mb-4"
                            placeholder="Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}

                        />
                        <div className="flex justify-end">
                            <button
                                className="bg-blue-500 text-white rounded px-4 py-2 mr-2"
                                onClick={addTask}
                            >
                                Add Task
                            </button>
                            <button
                                className="bg-gray-300 text-gray-700 rounded px-4 py-2"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskInputArea;
