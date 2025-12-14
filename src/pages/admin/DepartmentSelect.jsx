import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { Building } from 'lucide-react';

const departments = ['CSE', 'AIML', 'ECE'];

const DepartmentSelect = () => {
  const navigate = useNavigate();

  const handleSelect = (dept) => {
    navigate(`/admin/${dept}/overview`);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-vidya-gray-900">Admin Portal</h1>
          <p className="mt-2 text-lg text-vidya-gray-500">Please select a department to manage.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => handleSelect(dept)}
              className="group flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="bg-vidya-light-pink p-6 rounded-full group-hover:bg-vidya-pink transition-colors">
                <Building className="h-12 w-12 text-vidya-pink group-hover:text-white transition-colors" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-vidya-gray-800">{dept}</h2>
              <p className="mt-1 text-vidya-gray-500">Department</p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DepartmentSelect;
