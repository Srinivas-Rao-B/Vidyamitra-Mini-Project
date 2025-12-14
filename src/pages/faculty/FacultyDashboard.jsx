import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Book, Users } from 'lucide-react';
import SubjectFacultyView from './SubjectFacultyView';
import ProctorView from './ProctorView';

const FacultyDashboard = () => {
    const { user } = useAuth();
    const [selectedRole, setSelectedRole] = useState(null);

    if (!user) return null;

    if (selectedRole) {
        const ViewComponent = selectedRole.type === 'proctor' ? ProctorView : SubjectFacultyView;
        return <ViewComponent role={selectedRole} onBack={() => setSelectedRole(null)} />;
    }

    return (
        <div className="min-h-screen">
            <Header />
            <main className="container mx-auto p-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-vidya-gray-900">Welcome, {user.name}</h1>
                    <p className="mt-2 text-lg text-vidya-gray-500">Please select your role to continue.</p>
                </div>
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {user.allocations.map((alloc, index) => (
                        <Card key={index} className="hover:shadow-xl transition-shadow">
                            <Card.Content className="flex flex-col items-center text-center p-6">
                                {alloc.type === 'proctor' ? (
                                    <Users className="h-12 w-12 text-vidya-blue mb-4" />
                                ) : (
                                    <Book className="h-12 w-12 text-vidya-green mb-4" />
                                )}
                                <h2 className="text-lg font-bold capitalize">{alloc.type}</h2>
                                {alloc.type === 'proctor' ? (
                                    <div className="text-vidya-gray-500 text-sm">
                                        <p>{alloc.department} - Section {alloc.section}</p>
                                        <p>Semester {alloc.semester}</p>
                                    </div>
                                ) : (
                                    <div className="text-vidya-gray-500 text-sm">
                                        <p className="font-semibold">{alloc.subject}</p>
                                        <p>{alloc.department} - Section {alloc.section} - Sem {alloc.semester}</p>
                                    </div>
                                )}
                                <Button onClick={() => setSelectedRole(alloc)} className="mt-4">Select Role</Button>
                            </Card.Content>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default FacultyDashboard;
