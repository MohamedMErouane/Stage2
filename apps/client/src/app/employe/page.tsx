"use client"
import React, { useState, useEffect } from 'react';
import { BACKEND_URL } from '@/lib/Constants';

// Import Tailwind CSS directly
import 'tailwindcss/tailwind.css';

interface Employee {
  id: number;
  userId: string;
  status: string;
  createdAt: string;
  username: string; 
}

const EmployeeStatusDashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/employee-status`);
        const data = await response.json();
        console.log('hahahaha', data[0].user.username); // Check the structure of data

        const employeesWithData = await Promise.all(data.map(async (employee: { userId: string }) => {
          try {
            const userResponse = await fetch(`${BACKEND_URL}/user/${employee.userId}`);
            const userData = data[0].user.username;
            return {
              ...employee,
              username: data[0].user.username
            };
          } catch (error) {
            console.error('Error fetching user data:', error);
            return {
              ...employee,
              username: 'Unknown'
            };
          }
        }));

        setEmployees(employeesWithData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Employee Statuses</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {employees.map(employee => (
            <div key={employee.id} className="bg-white rounded-lg shadow-md p-4">
              <p className="text-black font-semibold">UserID: {employee.userId}</p>
              <p className='text-black'>Status: {employee.status}</p>
              <p className='text-black'>Username: {employee.username}</p>
              {/* Render other status fields as needed */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeStatusDashboard;
