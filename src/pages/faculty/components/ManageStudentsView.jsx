import React, { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Edit, Save, XCircle, CheckCircle } from 'lucide-react';
import { subjects as allSubjects, maxMarks } from '../../../data/mockData';

const ManageStudentsView = ({ students: initialStudents, role, isProctor }) => {
    const [students, setStudents] = useState(initialStudents);
    const [editingStudentId, setEditingStudentId] = useState(null);
    const [editData, setEditData] = useState({});
    const [selectedSubject, setSelectedSubject] = useState(isProctor ? allSubjects[0] : role.subject);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        setStudents(initialStudents);
    }, [initialStudents]);

    const handleEdit = (student) => {
        setEditingStudentId(student.id);
        setEditData(JSON.parse(JSON.stringify(student))); // Deep copy for editing
    };

    const handleCancel = () => {
        setEditingStudentId(null);
        setEditData({});
    };

    const handleSave = () => {
        setStudents(prevStudents => prevStudents.map(s => s.id === editingStudentId ? editData : s));
        
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        
        handleCancel();
    };

    const handleMarkChange = (subject, field, value) => {
        const newPerformance = { ...editData.performance };
        const subjectPerf = { ...newPerformance[subject], [field]: Number(value) };
        subjectPerf.total = subjectPerf.ia1 + subjectPerf.ia2 + subjectPerf.quiz + subjectPerf.aat;
        newPerformance[subject] = subjectPerf;
        setEditData(prev => ({ ...prev, performance: newPerformance }));
    };
    
    const handleAttendanceChange = (subject, value) => {
        setEditData(prev => ({
            ...prev,
            performance: { ...prev.performance, [subject]: { ...prev.performance[subject], attendance: { ...prev.performance[subject].attendance, present: Number(value) } } }
        }));
    };

    const subjectsToDisplay = isProctor ? [selectedSubject] : [role.subject];

    return (
        <Card>
            <Card.Header>
                <div className="flex justify-between items-center">
                    <Card.Title>Student Details for {isProctor ? `Section ${role.section}` : `${role.subject}`}</Card.Title>
                    {isProctor && (
                        <div className="flex items-center gap-2">
                            <label htmlFor="subject-filter" className="text-sm font-medium">Filter by Subject:</label>
                            <select id="subject-filter" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="p-2 border rounded bg-white shadow-sm">
                                {allSubjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                            </select>
                        </div>
                    )}
                </div>
            </Card.Header>
            <Card.Content>
                {showSuccess && (
                    <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center gap-2" role="alert">
                        <CheckCircle className="h-5 w-5"/>
                        <span className="block sm:inline">Student data updated successfully.</span>
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-vidya-gray-500">
                        <thead className="text-xs text-vidya-gray-700 uppercase bg-vidya-gray-50">
                            <tr>
                                <th className="px-4 py-3">USN</th>
                                <th className="px-4 py-3">Name</th>
                                {subjectsToDisplay.map(sub => (
                                    <React.Fragment key={sub}>
                                        <th className="px-2 py-3 text-center">IA1 ({maxMarks.ia1})</th>
                                        <th className="px-2 py-3 text-center">IA2 ({maxMarks.ia2})</th>
                                        <th className="px-2 py-3 text-center">Quiz ({maxMarks.quiz})</th>
                                        <th className="px-2 py-3 text-center">AAT ({maxMarks.aat})</th>
                                        <th className="px-2 py-3 text-center">Total ({maxMarks.total})</th>
                                        <th className="px-2 py-3 text-center">Attendance</th>
                                    </React.Fragment>
                                ))}
                                {!isProctor && <th className="px-4 py-3">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(s => (
                                <tr key={s.id} className="bg-white border-b hover:bg-vidya-gray-50">
                                    <td className="px-4 py-4 font-medium">{s.usn}</td>
                                    <td className="px-4 py-4">{s.name}</td>
                                    {subjectsToDisplay.map(sub => {
                                        const isEditing = editingStudentId === s.id && !isProctor;
                                        const perf = isEditing ? editData.performance[sub] : s.performance[sub];
                                        if (!perf) return <td key={sub} colSpan="6" className="text-center text-gray-400 italic">No data</td>;
                                        return (
                                            <React.Fragment key={sub}>
                                                <td className="px-2 py-2 text-center">{isEditing ? <Input type="number" value={perf.ia1} onChange={e => handleMarkChange(sub, 'ia1', e.target.value)} className="w-16 h-8 mx-auto"/> : perf.ia1}</td>
                                                <td className="px-2 py-2 text-center">{isEditing ? <Input type="number" value={perf.ia2} onChange={e => handleMarkChange(sub, 'ia2', e.target.value)} className="w-16 h-8 mx-auto"/> : perf.ia2}</td>
                                                <td className="px-2 py-2 text-center">{isEditing ? <Input type="number" value={perf.quiz} onChange={e => handleMarkChange(sub, 'quiz', e.target.value)} className="w-16 h-8 mx-auto"/> : perf.quiz}</td>
                                                <td className="px-2 py-2 text-center">{isEditing ? <Input type="number" value={perf.aat} onChange={e => handleMarkChange(sub, 'aat', e.target.value)} className="w-16 h-8 mx-auto"/> : perf.aat}</td>
                                                <td className="px-2 py-2 text-center font-bold">{perf.total}</td>
                                                <td className="px-2 py-2 text-center">{isEditing ? <Input type="number" value={perf.attendance.present} onChange={e => handleAttendanceChange(sub, e.target.value)} className="w-16 h-8 mx-auto"/> : `${perf.attendance.present}/${perf.attendance.total}`}</td>
                                            </React.Fragment>
                                        );
                                    })}
                                    {!isProctor && (
                                        <td className="px-4 py-4">
                                            {editingStudentId === s.id ? (
                                                <div className="flex gap-2">
                                                    <Button size="sm" onClick={handleSave}><Save className="h-4 w-4"/></Button>
                                                    <Button size="sm" variant="ghost" onClick={handleCancel}><XCircle className="h-4 w-4"/></Button>
                                                </div>
                                            ) : (
                                                <Button size="sm" variant="outline" onClick={() => handleEdit(s)}><Edit className="h-4 w-4"/></Button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card.Content>
        </Card>
    );
};

export default ManageStudentsView;
