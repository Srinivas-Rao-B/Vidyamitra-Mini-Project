import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import { BookOpen, CheckCircle, Calendar, Bell, Edit, PieChart as PieIcon, Users, Info } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import CurrentSemesterPerformance from '../../components/student/CurrentSemesterPerformance';
import StudentInfoModal from '../../components/student/StudentInfoModal';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  if (!user || !user.performance) return <div>Loading...</div>;

  const performanceArray = Object.entries(user.performance).map(([subject, data]) => ({
    subject,
    myMarks: Math.round((data.total / 70) * 100),
    classAvg: user.classAverage[subject] || 0,
  }));

  const strongSubjects = performanceArray.filter(p => p.myMarks >= 85).map(p => p.subject);
  const averageSubjects = performanceArray.filter(p => p.myMarks >= 70 && p.myMarks < 85).map(p => p.subject);
  const weakSubjects = performanceArray.filter(p => p.myMarks < 70).map(p => p.subject);

  const strengthData = [
    { name: 'Strong (>=85)', value: strongSubjects.length, subjects: strongSubjects },
    { name: 'Average (70-84)', value: averageSubjects.length, subjects: averageSubjects },
    { name: 'Weak (<70)', value: weakSubjects.length, subjects: weakSubjects },
  ].filter(d => d.value > 0);

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  const overallAverage = Math.round(performanceArray.reduce((acc, p) => acc + p.myMarks, 0) / performanceArray.length);

  const quickActions = [
    { name: 'Attendance', icon: CheckCircle, path: '/student/attendance' },
    { name: 'Study Resources', icon: BookOpen, path: '/student/resources' },
    { name: '3R Summary', icon: Edit, path: '/student/3r-summary' },
    { name: 'Study Planner', icon: Calendar, path: '/student/planner' },
    { name: 'Notifications', icon: Bell, path: '/student/notifications' },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-vidya-gray-900">Welcome, {user.name}</h1>
            <p className="text-vidya-gray-500">{user.department} - Section {user.section} | Semester {user.semester}</p>
          </div>
          <button onClick={() => setIsInfoModalOpen(true)} className="p-2 rounded-full hover:bg-vidya-pink/10 text-vidya-pink">
            <Info className="h-6 w-6" />
          </button>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="flex items-center p-6"><PieIcon className="h-10 w-10 text-vidya-pink mr-4"/><div><p className="text-sm text-vidya-gray-500">Overall Average</p><p className="text-2xl font-bold">{overallAverage}%</p></div></Card>
          <Card className="flex items-center p-6"><CheckCircle className="h-10 w-10 text-vidya-green mr-4"/><div><p className="text-sm text-vidya-gray-500">Attendance</p><p className="text-2xl font-bold">{user.overallAttendance}%</p></div></Card>
          <Card className="flex items-center p-6"><Users className="h-10 w-10 text-vidya-blue mr-4"/><div><p className="text-sm text-vidya-gray-500">USN</p><p className="text-lg font-bold">{user.usn}</p></div></Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Performance Bar Chart */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <Card>
              <Card.Header><Card.Title>My Performance vs Class Average</Card.Title></Card.Header>
              <Card.Content>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={performanceArray} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" tick={{fontSize: 12}}/>
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="myMarks" name="My Marks" fill="#EC4899" />
                    <Bar dataKey="classAvg" name="Class Average" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </Card.Content>
            </Card>
            <CurrentSemesterPerformance performance={user.performance} />
          </div>

          {/* Pie Chart + Summary */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card>
              <Card.Header><Card.Title>Subject Strength Analysis</Card.Title></Card.Header>
              <Card.Content className="flex flex-row items-center justify-center gap-6">
                
                {/* Pie chart */}
                <ResponsiveContainer width="60%" height={250}>
                  <PieChart>
                    <Pie
                      data={strengthData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                    >
                      {strengthData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white border p-2 text-sm shadow-lg">
                              <p className="font-medium">{data.name} ({data.value})</p>
                              {data.subjects.map((subj, idx) => (
                                <p key={idx}>{subj}</p>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>

                {/* Summary info beside Pie chart */}
                <div className="flex flex-col text-sm">
                  <p className="font-medium mb-1">Total: {performanceArray.length} subjects</p>
                  {strengthData.map((item, index) => (
                    <p key={item.name} className="mb-1">
                      <span className="font-medium">{item.name.split(' ')[0]}:</span> {item.value} subjects
                    </p>
                  ))}
                </div>

              </Card.Content>
            </Card>

            {/* Quick Actions */}
            <Card>
              <Card.Header><Card.Title>Quick Actions</Card.Title></Card.Header>
              <Card.Content className="grid grid-cols-3 gap-2">
                {quickActions.map(action => (
                  <Link to={action.path} key={action.name} className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-vidya-light-pink text-center">
                    <action.icon className="h-6 w-6 text-vidya-pink mb-1"/>
                    <span className="text-xs font-medium text-vidya-gray-700">{action.name}</span>
                  </Link>
                ))}
              </Card.Content>
            </Card>
          </div>
        </div>
      </main>
      {isInfoModalOpen && <StudentInfoModal user={user} onClose={() => setIsInfoModalOpen(false)} />}
    </div>
  );
};

export default StudentDashboard;
