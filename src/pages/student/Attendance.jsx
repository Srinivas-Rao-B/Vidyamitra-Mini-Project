import React from 'react';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import { ChevronLeft, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ProgressCircle from '../../components/ui/ProgressCircle';

const StudentAttendance = () => {
    const { user } = useAuth();
    if (!user) return null;

    const attendanceData = Object.entries(user.performance).map(([subject, data]) => {
        const percentage = Math.round((data.attendance.present / data.attendance.total) * 100);
        let status = 'Good';
        if (percentage < 75) status = 'Low';
        else if (percentage < 85) status = 'Average';
        return { subject, ...data.attendance, percentage, status };
    });

    const lowAttendanceSubjects = attendanceData.filter(s => s.status === 'Low');

    const getStatusColor = (status) => {
        if (status === 'Good') return 'text-vidya-green';
        if (status === 'Average') return 'text-vidya-yellow';
        return 'text-red-500';
    };

    return (
        <div className="min-h-screen">
            <Header />
            <main className="container mx-auto p-8">
                <Link to="/student/dashboard" className="inline-flex items-center text-vidya-pink mb-4 hover:underline"><ChevronLeft className="h-4 w-4 mr-1" />Back to Dashboard</Link>
                <h1 className="text-3xl font-bold text-vidya-gray-900 mb-6">My Attendance</h1>
                
                {lowAttendanceSubjects.length > 0 && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
                        <div className="flex">
                            <div className="py-1"><AlertTriangle className="h-6 w-6 text-yellow-500 mr-4" /></div>
                            <div>
                                <p className="font-bold">Attendance Alert</p>
                                <p className="text-sm">You have {lowAttendanceSubjects.length} subject(s) with attendance below 75%. Please improve your attendance.</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card><Card.Content className="text-center"><p className="text-3xl font-bold">{user.overallAttendance}%</p><p className="text-vidya-gray-500">Overall Attendance</p></Card.Content></Card>
                    <Card><Card.Content className="text-center"><p className="text-3xl font-bold">{attendanceData.length}</p><p className="text-vidya-gray-500">Total Subjects</p></Card.Content></Card>
                    <Card><Card.Content className="text-center"><p className="text-3xl font-bold text-vidya-green">{attendanceData.filter(s => s.status === 'Good').length}</p><p className="text-vidya-gray-500">Good Standing</p></Card.Content></Card>
                    <Card><Card.Content className="text-center"><p className="text-3xl font-bold text-red-500">{lowAttendanceSubjects.length}</p><p className="text-vidya-gray-500">Needs Attention</p></Card.Content></Card>
                </div>

                <Card>
                    <Card.Header><Card.Title>Detailed Attendance Records</Card.Title></Card.Header>
                    <Card.Content>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-vidya-gray-500">
                                <thead className="text-xs text-vidya-gray-700 uppercase bg-vidya-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Subject</th>
                                        <th scope="col" className="px-6 py-3">Attended</th>
                                        <th scope="col" className="px-6 py-3">Total Classes</th>
                                        <th scope="col" className="px-6 py-3">Percentage</th>
                                        <th scope="col" className="px-6 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceData.map(item => (
                                        <tr key={item.subject} className="bg-white border-b hover:bg-vidya-gray-50">
                                            <td className="px-6 py-4 font-medium text-vidya-gray-900">{item.subject}</td>
                                            <td className="px-6 py-4">{item.present}</td>
                                            <td className="px-6 py-4">{item.total}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                        <div className={`h-2.5 rounded-full ${getStatusColor(item.status).replace('text-', 'bg-')}`} style={{width: `${item.percentage}%`}}></div>
                                                    </div>
                                                    <span>{item.percentage}%</span>
                                                </div>
                                            </td>
                                            <td className={`px-6 py-4 font-bold ${getStatusColor(item.status)}`}>{item.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card.Content>
                </Card>
            </main>
        </div>
    );
};

export default StudentAttendance;
