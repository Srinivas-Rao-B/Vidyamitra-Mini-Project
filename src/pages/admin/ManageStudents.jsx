import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { db, addOrUpdateStudent } from '../../data/mockData';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { PlusCircle, Edit, Trash2, Eye } from 'lucide-react';
import StudentFormModal from '../../components/admin/StudentFormModal';
import Input from '../../components/ui/Input';

const ManageStudents = () => {
    const { department } = useParams();
    const [students, setStudents] = useState(db.departments[department]?.students || []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isViewMode, setIsViewMode] = useState(false);

    const [filters, setFilters] = useState({ semester: 'All', section: 'All', search: '' });

    const handleOpenModal = (student = null, viewMode = false) => {
        setSelectedStudent(student);
        setIsViewMode(viewMode);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedStudent(null);
        setIsViewMode(false);
    };

    const handleSave = (studentData) => {
        addOrUpdateStudent(department, studentData);
        setStudents([...db.departments[department].students]);
        handleCloseModal();
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const filteredStudents = students.filter(s => {
        const searchLower = filters.search.toLowerCase();
        return (
            (filters.semester === 'All' || s.semester == filters.semester) &&
            (filters.section === 'All' || s.section === filters.section) &&
            (s.name.toLowerCase().includes(searchLower) || s.usn.toLowerCase().includes(searchLower))
        );
    });

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-vidya-gray-900">Manage Students ({department})</h1>
                <Button onClick={() => handleOpenModal()}><PlusCircle className="h-4 w-4 mr-2" />Add New Student</Button>
            </div>
            
            <Card className="mb-6">
                <Card.Content className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input name="search" placeholder="Search by name or USN..." value={filters.search} onChange={handleFilterChange} />
                     <div>
                        <select name="semester" value={filters.semester} onChange={handleFilterChange} className="w-full p-2 border rounded bg-white shadow-sm h-10">
                            <option value="All">All Semesters</option>
                            {[...new Set(students.map(s => s.semester))].sort().map(sem => <option key={sem} value={sem}>Semester {sem}</option>)}
                        </select>
                    </div>
                    <div>
                        <select name="section" value={filters.section} onChange={handleFilterChange} className="w-full p-2 border rounded bg-white shadow-sm h-10">
                            <option value="All">All Sections</option>
                            {[...new Set(students.map(s => s.section))].sort().map(sec => <option key={sec} value={sec}>Section {sec}</option>)}
                        </select>
                    </div>
                </Card.Content>
            </Card>

            <Card>
                <Card.Content>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-vidya-gray-500">
                            <thead className="text-xs text-vidya-gray-700 uppercase bg-vidya-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3">USN</th>
                                    <th scope="col" className="px-6 py-3">Semester</th>
                                    <th scope="col" className="px-6 py-3">Section</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map(student => (
                                    <tr key={student.id} className="bg-white border-b hover:bg-vidya-gray-50">
                                        <th scope="row" className="px-6 py-4 font-medium text-vidya-gray-900 whitespace-nowrap">{student.name}</th>
                                        <td className="px-6 py-4">{student.usn}</td>
                                        <td className="px-6 py-4">{student.semester}</td>
                                        <td className="px-6 py-4">{student.section}</td>
                                        <td className="px-6 py-4 flex gap-1">
                                            <Button variant="ghost" size="sm" onClick={() => handleOpenModal(student, true)}><Eye className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleOpenModal(student)}><Edit className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredStudents.length === 0 && <p className="text-center p-4">No students found matching your criteria.</p>}
                    </div>
                </Card.Content>
            </Card>
            {isModalOpen && <StudentFormModal student={selectedStudent} onClose={handleCloseModal} onSave={handleSave} isViewMode={isViewMode} />}
        </>
    );
};

export default ManageStudents;
