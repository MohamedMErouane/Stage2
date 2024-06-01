// EmployeeCard.tsx
import React from 'react';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  status: string;
}



interface Props {
  employee: Employee;
}

const EmployeeCard: React.FC<Props> = ({ employee }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-4 py-2">
        <h3 className="text-lg font-semibold">{employee.firstName} {employee.lastName}</h3>
        <p className="text-sm text-gray-500">{employee.status}</p>
      </div>
      
    </div>
  );
};

export default EmployeeCard;
