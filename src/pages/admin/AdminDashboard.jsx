import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { db, addDepartmentEvent } from '../../data/mockData';
import Card from '../../components/ui/Card';
import { Users, UserCheck, DollarSign, BarChart, Calendar, Plus } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import SemesterProgressChart from '../../components/admin/SemesterProgressChart';
import FacultyDistribution from '../../components/admin/FacultyDistribution';
import StudentDemographicsChart from '../../components/admin/StudentDemographicsChart';

const AdminDashboard = () => {
    const { department } = useParams();
    const deptData = db.departments[department];
    const [events, setEvents] = useState(db.departmentEvents[department] || []);
    const [showEventModal, setShowEventModal] = useState(false);
    const [newEvent, setNewEvent] = useState({ name: '', date: '' });

    if (!deptData) return <div>Department not found</div>;

    const stats = [
        { name: 'Total Students', value: deptData.overview.totalStudents, icon: Users, color: 'text-vidya-pink' },
        { name: 'Total Faculty', value: deptData.overview.totalFaculty, icon: UserCheck, color: 'text-vidya-blue' },
        { name: 'Fees Paid', value: `₹${(deptData.overview.feesPaid / 100000).toFixed(2)}L`, icon: DollarSign, color: 'text-vidya-green' },
        { name: 'Fees Remaining', value: `₹${(deptData.overview.feesRemaining / 100000).toFixed(2)}L`, icon: BarChart, color: 'text-vidya-yellow' },
    ];

    const handleAddEvent = () => {
        if (newEvent.name && newEvent.date) {
            addDepartmentEvent(department, newEvent);
            setEvents([...db.departmentEvents[department]]);
            setShowEventModal(false);
            setNewEvent({ name: '', date: '' });
        }
    };

    return (
        <>
            <h1 className="text-3xl font-bold text-vidya-gray-900 mb-6">{department} Dashboard</h1>
            <p className="text-vidya-gray-500 mb-8 -mt-4">Overview of department progress.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map(stat => (
                    <Card key={stat.name}>
                        <Card.Content className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-full bg-opacity-10 ${stat.color.replace('text-', 'bg-')}`}>
                                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                                <p className="text-sm font-medium text-vidya-gray-500">{stat.name}</p>
                            </div>
                            <p className="text-3xl font-bold text-vidya-gray-900 ml-1">{stat.value}</p>
                        </Card.Content>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                    <SemesterProgressChart students={deptData.students} />
                </div>
                <div className="lg:col-span-2">
                    <FacultyDistribution faculty={deptData.faculty} />
                </div>
                <div className="lg:col-span-2">
                    <Card>
                        <Card.Header className="flex justify-between items-center">
                            <Card.Title>Department Events</Card.Title>
                            <Button size="sm" variant="ghost" onClick={() => setShowEventModal(true)}><Plus className="h-4 w-4 mr-1" /> Add</Button>
                        </Card.Header>
                        <Card.Content>
                            <div className="space-y-3 max-h-48 overflow-y-auto">
                                {events.sort((a, b) => new Date(a.date) - new Date(b.date)).map(event => (
                                    <div key={event.id} className="flex items-center justify-between p-2 bg-vidya-light-pink/50 rounded-lg">
                                        <p className="font-medium text-vidya-gray-800">{event.name}</p>
                                        <div className="flex items-center gap-2 text-sm text-vidya-pink">
                                            <Calendar className="h-4 w-4" />
                                            <span>{new Date(event.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card.Content>
                    </Card>
                </div>
                 <div className="lg:col-span-3">
                    <StudentDemographicsChart students={deptData.students} />
                </div>
            </div>

            {showEventModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-96">
                        <Card.Header><Card.Title>Add New Event</Card.Title></Card.Header>
                        <Card.Content className="space-y-4">
                            <div><label className="text-sm font-medium">Event Name</label><Input value={newEvent.name} onChange={(e) => setNewEvent({...newEvent, name: e.target.value})} className="mt-1"/></div>
                            <div><label className="text-sm font-medium">Event Date</label><Input type="date" value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} className="mt-1"/></div>
                        </Card.Content>
                        <div className="p-4 border-t flex justify-end gap-2">
                            <Button variant="ghost" onClick={() => setShowEventModal(false)}>Cancel</Button>
                            <Button onClick={handleAddEvent}>Save Event</Button>
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
};

export default AdminDashboard;
