"use client"
import { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { BACKEND_URL } from '@/lib/Constants';
import { Todo, User } from '@/lib/types';

const TodoList = () => {
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user.isAdmin) {
      fetchUsers();
      console.log('hello');
    }
    fetchTasks(session?.user.id);
    updateCurrentDate();
    const interval = setInterval(updateCurrentDate, 86400000);
    return () => clearInterval(interval);
  }, []);

  const fetchTasks = async (userId: string | undefined) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/todos/${userId}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:3333/user`);
      if (response.status !== 200) {
        throw new Error('Failed to fetch users');
      }
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  
  const addTask = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (session?.user.isAdmin && !selectedUser) {
      alert('Please select a user');
      return;
    }
    try {
      const response = await axios.post(`${BACKEND_URL}/todos`, {
        description: newTask,
        userId: session?.user.isAdmin ? selectedUser : session?.user.id,
      });
      fetchTasks(session?.user.isAdmin ? selectedUser : session?.user.id);
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await axios.delete(`${BACKEND_URL}/todos/${taskId}`);
      fetchTasks(session?.user.id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      await axios.put(`${BACKEND_URL}/todos/${taskId}`, { completed: !completed });
      fetchTasks(session?.user.id);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const updateCurrentDate = () => {
    const now = new Date();
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    const formattedDate = now.toLocaleDateString('en-US', options);
    setCurrentDate(formattedDate);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded-md shadow-md">
      <p className="text-lg text-black">
        Hi @{session?.user.firstName}, set yourself up for success! 🚀
      </p>
      <h1 className="text-2xl font-normal my-4 text-black">
        What do you want to achieve?
      </h1>
      <p className="text-sm text-black text-right mb-4">☀️{currentDate}</p>
      {session?.user.isAdmin && (
        <div>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="p-2 border rounded-md mb-4"
          >
            <option value="">Select user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        </div>
      )}
      <form onSubmit={addTask} className="mb-4 flex">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter task..."
          className="p-2 mr-2 border rounded-md flex-grow text-black"
        />
        <button type="submit" className="px-4 py-2 bg-black text-white rounded-md">
          Add Task
        </button>
      </form>
      {tasks.length > 0 && (
        <ul className="todo-list text-black">
          {tasks.map((task) => (
            <li key={task.id} className={`todo-item ${task.completed ? 'line-through' : ''}`}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task.id, task.completed)}
                className="mr-2"
              />
              <span>{task.description}</span>
              <button onClick={() => deleteTask(task.id)} className="ml-auto text-red-500">
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      )}
      <style jsx>{`
        .todo-item {
          background-color: #fff;
          padding: 8px;
          border-radius: 4px;
          display: flex;
          align-items: center;
        }
        .todo-item.completed {
          text-decoration: line-through;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
};

export default TodoList;
