import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import { ChevronLeft, LayoutDashboard, User, CheckSquare, MessageSquare } from 'lucide-react';
import { db } from '../../data/mockData';
import SubjectDashboard from './components/SubjectDashboard';
import ManageStudentsView from './components/ManageStudentsView';
import MarkAttendance from './components/MarkAttendance';
import SendMessages from './components/SendMessages';
import { useAuth } from '../../hooks/useAuth';

const SubjectFacultyView = ({ role, onBack }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const students = db.departments[role.department]?.students.filter(s => s.section === role.section && s.semester === role.semester) || [];

    const tabs = [
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
        { id: 'students', name: 'Manage Students', icon: User },
        { id: 'attendance', name: 'Mark Attendance', icon: CheckSquare },
        { id: 'messages', name: 'Send Messages', icon: MessageSquare },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <SubjectDashboard role={role} students={students} />;
            case 'students':
                return <ManageStudentsView role={role} students={students} isProctor={false} />;
            case 'attendance':
                return <MarkAttendance students={students} subject={role.subject} />;
            case 'messages':
                return <SendMessages students={students} senderName={user.name} subject={role.subject} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen">
            <Header />
            <main className="container mx-auto p-8">
                <Button variant="ghost" onClick={onBack} className="mb-4"><ChevronLeft className="h-4 w-4 mr-1" /> Back to Role Selection</Button>
                <h1 className="text-3xl font-bold text-vidya-gray-900 mb-2">{role.subject} - Section {role.section} (Sem {role.semester})</h1>
                
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === tab.id ? 'border-vidya-pink text-vidya-pink' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                <tab.icon className="h-5 w-5" /> {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>
                
                <div>{renderContent()}</div>
            </main>
        </div>
    );
};

export default SubjectFacultyView;
