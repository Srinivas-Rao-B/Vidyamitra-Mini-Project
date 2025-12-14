import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogOut, UserCircle } from 'lucide-react';
import Button from '../ui/Button';
import Logo from '../ui/Logo';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo className="text-xl" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <UserCircle className="h-6 w-6 text-vidya-gray-500" />
              <span className="font-medium text-vidya-gray-700 hidden sm:block">{user?.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
