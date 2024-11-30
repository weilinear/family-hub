'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        var host = window.location.hostname;
        const response = await axios.get(`http://${host}:5005/tasks/home`);
        setTasks(response.data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();

    // Set up interval to refresh every minute (60000 milliseconds)
    const intervalId = setInterval(fetchTasks, 60000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);    
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    const statusOrder = {
      'In progress': 1,
      'Not started': 2,
      'Done': 3,
    };

    const statusComparison = statusOrder[a.status] - statusOrder[b.status];

    if (statusComparison !== 0) {
      return statusComparison;
    }


    const dueDateA = new Date(a.due_date?.end_time ? new Date(a.due_date?.end_time).toLocaleString("en-US", { timeZone: "America/Los_Angeles" }) : '');
    const dueDateB = new Date(b.due_date?.end_time ? new Date(b.due_date?.end_time).toLocaleString("en-US", { timeZone: "America/Los_Angeles" }) : '');

    if(isNaN(dueDateA) && !isNaN(dueDateB))
    {
      return 1;
    }
    if(!isNaN(dueDateA) && isNaN(dueDateB))
    {
      return -1;
    }

    if(isNaN(dueDateA) && isNaN(dueDateB))
    {
      return 0;
    }

    return dueDateA - dueDateB;
  });  

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-500 text-white'; // Notion-style red
      case 'Medium': return 'bg-yellow-300 text-gray-800'; // Notion-style yellow
      case 'Low': return 'bg-green-300 text-gray-800'; // Notion-style green
      default: return 'bg-gray-200 text-gray-800'; // Default gray
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Not started': return 'bg-gray-200 text-gray-800'; // Notion-style gray
      case 'Done': return 'bg-green-300 text-gray-800';    // Notion-style green
      case 'In progress': return 'bg-blue-200 text-gray-800'; // Notion-style blue
      default: return 'bg-gray-200 text-gray-800';       // Default gray
    }
  };

  const getDueDateColor = (dueDate, status) => {
    if (!dueDate || status === 'Done') {  // Don't apply special styling if Done or no due date
      return 'text-gray-700'; // Default color
    }

    const now = new Date();
    const due = new Date(dueDate);
    const timeDiff = due.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff <= 2 && daysDiff >0 ) {
      return 'text-red-500'; // Approaching within 2 days
    } else if (daysDiff <= 0) {
      return 'bg-red-500 text-white'; // Overdue
    } else {
      return 'text-gray-700'; // Default color
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-50"> {/* Light gray background */}
      <h1 className="text-2xl font-bold mb-4 text-gray-800">To-Do List</h1>
      <div className="overflow-x-auto rounded-lg shadow-md"> {/* Rounded corners and shadow */}
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-gray-600">  {/* Light header */}
              <th className="w-1/2 px-4 py-2 text-left font-medium">Task Name</th>
              <th className="w-1/6 px-4 py-2 text-left font-medium">Priority</th>
              <th className="w-1/6 px-4 py-2 text-left font-medium">Status</th>
              <th className="w-1/6 px-4 py-2 text-left font-medium">Due Date</th> 
            </tr>
          </thead>
          <tbody>
            {sortedTasks.map((task, index) => (
              <tr key={index} className="border-b border-gray-200"> {/* Subtle border */}
                <td className="w-1/2 px-4 py-2 font-medium text-gray-800 break-words">{task.name}</td>
                <td className={`w-1/6 px-4 py-2 text-center rounded ${getPriorityColor(task.priority)}`}>{task.priority}</td>
                <td className={`w-1/6 px-4 py-2 text-center rounded ${getStatusColor(task.status)}`}>{task.status}</td>
                <td className={`w-1/6 px-4 py-2 ${getDueDateColor(task.due_date ? (task.due_date.end? task.due_date.end : task.due_date.start): null, task.status)}`}>
                  {task.due_date ? (task.due_date.end? task.due_date.end : task.due_date.start) : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TodoList;
