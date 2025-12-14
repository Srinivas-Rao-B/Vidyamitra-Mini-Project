import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { CheckCircle } from 'lucide-react';

const MarkAttendance = ({ students, subject }) => {
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);
    const [attendance, setAttendance] = useState(() => {
        const initialState = {};
        students.forEach(s => {
            initialState[s.id] = 'present'; // Default to present
        });
        return initialState;
    });
    const [showSuccess, setShowSuccess] = useState(false);

    const handleStatusChange = (studentId, status) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSubmit = () => {
        console.log({
            date: selectedDate,
            subject: subject,
            attendance: attendance
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <Card>
            <Card.Header>
                <div className="flex justify-between items-center">
                    <Card.Title>Mark Attendance for {subject}</Card.Title>
                    <Input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-48" />
                </div>
            </Card.Header>
            <Card.Content>
                {showSuccess && (
                    <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center gap-2" role="alert">
                        <CheckCircle className="h-5 w-5"/>
                        <span className="block sm:inline">Attendance for {selectedDate} submitted successfully!</span>
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-vidya-gray-500">
                        <thead className="text-xs text-vidya-gray-700 uppercase bg-vidya-gray-50">
                            <tr>
                                <th className="px-6 py-3">USN</th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.id} className="bg-white border-b hover:bg-vidya-gray-50">
                                    <td className="px-6 py-4 font-medium">{student.usn}</td>
                                    <td className="px-6 py-4">{student.name}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-flex rounded-md shadow-sm" role="group">
                                            <button type="button" onClick={() => handleStatusChange(student.id, 'present')} className={`px-4 py-2 text-sm font-medium border ${attendance[student.id] === 'present' ? 'bg-vidya-pink text-white border-vidya-pink' : 'bg-white text-gray-900 border-gray-200'} rounded-l-lg hover:bg-gray-100`}>
                                                Present
                                            </button>
                                            <button type="button" onClick={() => handleStatusChange(student.id, 'absent')} className={`px-4 py-2 text-sm font-medium border ${attendance[student.id] === 'absent' ? 'bg-vidya-blue text-white border-vidya-blue' : 'bg-white text-gray-900 border-gray-200'} rounded-r-md hover:bg-gray-100`}>
                                                Absent
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-6 flex justify-end">
                    <Button onClick={handleSubmit}>Submit Attendance</Button>
                </div>
            </Card.Content>
        </Card>
    );
};

export default MarkAttendance;
