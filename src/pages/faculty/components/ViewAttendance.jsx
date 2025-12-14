import React from 'react';
import Card from '../../../components/ui/Card';
import { SEM1_SUBJECTS, SEM2_SUBJECTS } from '../../../data/mockData';

const ViewAttendance = ({ role, students }) => {
    const subjects = role.semester === 1 ? SEM1_SUBJECTS : SEM2_SUBJECTS;
    
    const getStatusColor = (percentage) => {
        if (percentage >= 85) return 'bg-vidya-green';
        if (percentage >= 75) return 'bg-vidya-yellow';
        return 'bg-red-500';
    };

    return (
        <Card>
            <Card.Header><Card.Title>Overall Student Attendance</Card.Title></Card.Header>
            <Card.Content>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-vidya-gray-500">
                        <thead className="text-xs text-vidya-gray-700 uppercase bg-vidya-gray-50">
                            <tr>
                                <th className="px-4 py-3">Student Name</th>
                                {subjects.map(sub => (
                                    <th key={sub} className="px-2 py-3 text-center min-w-[150px]">{sub}</th>
                                ))}
                                <th className="px-4 py-3 text-center">Overall</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(s => {
                                const overall = { present: 0, total: 0 };
                                return (
                                    <tr key={s.id} className="bg-white border-b hover:bg-vidya-gray-50">
                                        <td className="px-4 py-4 font-medium">{s.name}</td>
                                        {subjects.map(sub => {
                                            const perf = s.performance[sub];
                                            if (!perf) return <td key={sub} className="px-2 py-4 text-center italic text-gray-400">N/A</td>;
                                            
                                            overall.present += perf.attendance.present;
                                            overall.total += perf.attendance.total;
                                            const percentage = Math.round((perf.attendance.present / perf.attendance.total) * 100);

                                            return (
                                                <td key={sub} className="px-2 py-4 text-center">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <span className="font-semibold">{perf.attendance.present}/{perf.attendance.total} ({percentage}%)</span>
                                                        <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-[100px]">
                                                            <div className={`h-2.5 rounded-full ${getStatusColor(percentage)}`} style={{width: `${percentage}%`}}></div>
                                                        </div>
                                                    </div>
                                                </td>
                                            );
                                        })}
                                        <td className="px-4 py-4 text-center font-bold">
                                            {overall.total > 0 ? `${Math.round((overall.present / overall.total) * 100)}%` : '-'}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </Card.Content>
        </Card>
    );
};

export default ViewAttendance;
