import React from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, LogOut, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../ui/Logo';

const AdminLayout = () => {
    const { department } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const navLinks = [
        { name: 'Dashboard', path: `/admin/${department}/overview`, icon: LayoutDashboard },
        { name: 'Manage Faculty', path: `/admin/${department}/faculty`, icon: UserCheck },
        { name: 'Manage Students', path: `/admin/${department}/students`, icon: Users },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-vidya-light-pink">
            <aside className="w-64 bg-white flex flex-col border-r">
                <div className="p-4 border-b">
                    <Logo />
                </div>
                <div className="p-4">
                    <h2 className="text-xl font-bold text-vidya-gray-900">{department}</h2>
                    <p className="text-sm text-vidya-gray-500">Admin Panel</p>
                </div>
                <nav className="flex-1 px-4">
                    {navLinks.map(link => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.path ? 'bg-vidya-pink text-white shadow' : 'text-vidya-gray-700 hover:bg-vidya-light-pink'}`}
                        >
                            <link.icon className="h-5 w-5" />
                            {link.name}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <button onClick={() => navigate('/admin/dashboard')} className="w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium text-vidya-gray-700 hover:bg-vidya-light-pink">
                        <ChevronsLeft className="h-5 w-5" />
                        Change Department
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50">
                        <LogOut className="h-5 w-5" />
                        Logout
                    </button>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
