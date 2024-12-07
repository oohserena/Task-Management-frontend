// api.js
const BASE_URL = "http://localhost:5000";  // Replace with your backend URL

export const fetchUserTasks = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/tasks`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch user tasks:", error);
    throw error;
  }
};

export const addTaskToUser = async (userId, taskData) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to add task:", error);
    throw error;
  }
};

export const deleteTaskFromUser = async (userId, taskId) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/tasks/${taskId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to delete task:", error);
    throw error;
  }
};

export const fetchTeamMembers = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/teams/${userId}`)
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch team members', error)
    throw error;
  }
};
