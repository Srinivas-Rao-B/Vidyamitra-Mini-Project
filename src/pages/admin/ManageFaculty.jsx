import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { db, addOrUpdateFaculty } from '../../data/mockData';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { PlusCircle, Edit, Trash2, Eye } from 'lucide-react';
import FacultyFormModal from '../../components/admin/FacultyFormModal';
import Input from '../../components/ui/Input';

const ManageFaculty = () => {
    const { department } = useParams();
    const [faculty, setFaculty] = useState(db.departments[department]?.faculty || []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [isViewMode, setIsViewMode] = useState(false);
    
    const [filters, setFilters] = useState({ semester: 'All', section: 'All' });

    const handleOpenModal = (facultyMember = null, viewMode = false) => {
        setSelectedFaculty(facultyMember);
        setIsViewMode(viewMode);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedFaculty(null);
        setIsViewMode(false);
    };

    const handleSave = (facultyData) => {
        addOrUpdateFaculty(department, facultyData);
        setFaculty([...db.departments[department].faculty]);
        handleCloseModal();
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const getFacultyAllocations = (f) => {
        if (!f.allocations) return { roles: [], semesters: [], sections: [] };

        if (Array.isArray(f.allocations)) {
            return {
                roles: [...new Set(f.allocations.map(a => a.type === 'proctor' ? 'Proctor' : 'Subject Faculty'))],
                semesters: [...new Set(f.allocations.map(a => String(a.semester)))],
                sections: [...new Set(f.allocations.map(a => a.section))],
            };
        }
        // Handle the object format
        return {
            roles: f.allocations.roles || [],
            semesters: f.allocations.semesters || [],
            sections: f.allocations.sections || [],
        };
    };

    const filteredFaculty = faculty.filter(f => {
        const { semesters, sections } = getFacultyAllocations(f);
        
        if (!Array.isArray(semesters) || !Array.isArray(sections)) return false;

        return (
            (filters.semester === 'All' || semesters.includes(filters.semester)) &&
            (filters.section === 'All' || sections.includes(filters.section))
        );
    });

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-vidya-gray-900">Manage Faculty ({department})</h1>
                <Button onClick={() => handleOpenModal()}><PlusCircle className="h-4 w-4 mr-2" />Add New Faculty</Button>
            </div>

            <Card className="mb-6">
                <Card.Content className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <select name="semester" value={filters.semester} onChange={handleFilterChange} className="w-full p-2 border rounded bg-white shadow-sm h-10">
                            <option value="All">All Semesters</option>
                            <option value="1">Semester 1</option>
                            <option value="2">Semester 2</option>
                        </select>
                    </div>
                    <div>
                        <select name="section" value={filters.section} onChange={handleFilterChange} className="w-full p-2 border rounded bg-white shadow-sm h-10">
                            <option value="All">All Sections</option>
                            <option value="A">Section A</option>
                            <option value="B">Section B</option>
                            <option value="C">Section C</option>
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
                                    <th scope="col" className="px-6 py-3">Name / SSN</th>
                                    <th scope="col" className="px-6 py-3">Designation</th>
                                    <th scope="col" className="px-6 py-3">Contact</th>
                                    <th scope="col" className="px-6 py-3">Allocations</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFaculty.map(f => {
                                    const { roles, semesters, sections } = getFacultyAllocations(f);

                                    return (
                                        <tr key={f.id} className="bg-white border-b hover:bg-vidya-gray-50">
                                            <td className="px-6 py-4 font-medium text-vidya-gray-900">
                                                {f.name}
                                                <p className="text-xs text-vidya-gray-500">{f.ssn}</p>
                                            </td>
                                            <td className="px-6 py-4">{f.designation}</td>
                                            <td className="px-6 py-4">
                                                {f.email}
                                                <p className="text-xs text-vidya-gray-500">{f.phone}</p>
                                            </td>
                                            <td className="px-6 py-4 text-xs">
                                                <div className="flex flex-wrap gap-1">
                                                    {roles?.map(r => <span key={r} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{r}</span>)}
                                                </div>
                                                <p className="mt-1">Sem: {semesters?.join(', ')} | Sec: {sections?.join(', ')}</p>
                                            </td>
                                            <td className="px-6 py-4 flex gap-1">
                                                <Button variant="ghost" size="sm" onClick={() => handleOpenModal(f, true)}><Eye className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleOpenModal(f)}><Edit className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filteredFaculty.length === 0 && <p className="text-center p-4">No faculty found matching your criteria.</p>}
                    </div>
                </Card.Content>
            </Card>
            {isModalOpen && <FacultyFormModal faculty={selectedFaculty} onClose={handleCloseModal} onSave={handleSave} isViewMode={isViewMode} />}
        </>
    );
};

export default ManageFaculty;
