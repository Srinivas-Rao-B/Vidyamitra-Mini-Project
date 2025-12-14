import React from 'react';
import { GraduationCap } from 'lucide-react';

const Logo = ({ className }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="bg-vidya-dark-pink p-3 rounded-full">
        <GraduationCap className="text-white h-8 w-8" />
      </div>
      <h1 className="text-3xl font-bold text-vidya-dark-pink">Vidyamitra</h1>
    </div>
  );
};

export default Logo;
