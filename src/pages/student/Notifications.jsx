import React from 'react';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import { ChevronLeft, AlertTriangle, Clock, Info } from 'lucide-react';
import { db } from '../../data/mockData';

const Notifications = () => {
    const notifications = db.notifications;

    const getIcon = (priority) => {
        switch (priority) {
            case 'high': return <AlertTriangle className="h-5 w-5 text-red-500" />;
            case 'medium': return <Clock className="h-5 w-5 text-yellow-500" />;
            case 'low': return <Info className="h-5 w-5 text-blue-500" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen">
            <Header />
            <main className="container mx-auto p-8">
                <Link to="/student/dashboard" className="inline-flex items-center text-vidya-pink mb-4 hover:underline"><ChevronLeft className="h-4 w-4 mr-1" />Back to Dashboard</Link>
                <h1 className="text-3xl font-bold text-vidya-gray-900 mb-6">Notifications</h1>
                <Card>
                    <Card.Content>
                        <div className="space-y-2">
                            {notifications.map(notif => (
                                <div key={notif.id} className="flex items-start gap-4 p-4 border-b last:border-b-0 hover:bg-vidya-light-pink/50">
                                    <div className="flex-shrink-0 mt-1">{getIcon(notif.priority)}</div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold">{notif.title}</p>
                                                <p className="text-sm text-vidya-gray-500">From: {notif.sender} | Subject: {notif.subject}</p>
                                            </div>
                                            <p className="text-xs text-vidya-gray-500 flex-shrink-0 ml-4">{notif.time}</p>
                                        </div>
                                        <p className="text-vidya-gray-700 mt-1">{notif.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card.Content>
                </Card>
            </main>
        </div>
    );
};

export default Notifications;
