import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { X } from 'lucide-react';
import { SEM1_SUBJECTS, SEM2_SUBJECTS } from '../../data/mockData';

const FacultyFormModal = ({ faculty, onClose, onSave, isViewMode }) => {
    const getInitialFormData = (facultyMember) => {
        const initialData = {
            name: '', ssn: '', email: '', phone: '', designation: 'Asst. Professor', qualification: '', experience: '', salary: '', password: '',
        };
        if (!facultyMember) return initialData;
        return { ...initialData, ...JSON.parse(JSON.stringify(facultyMember)) };
    };

    const [formData, setFormData] = useState(() => getInitialFormData(faculty));
    const [adminPassword, setAdminPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // State for new allocation UI
    const [isSubjectRole, setIsSubjectRole] = useState(false);
    const [isProctorRole, setIsProctorRole] = useState(false);
    const [proctorAlloc, setProctorAlloc] = useState({ semester: '', section: '' });
    const [subjectAlloc, setSubjectAlloc] = useState({});

    useEffect(() => {
        if (faculty?.allocations) {
            const proctorRole = faculty.allocations.find(a => a.type === 'proctor');
            if (proctorRole) {
                setIsProctorRole(true);
                setProctorAlloc({ semester: String(proctorRole.semester), section: proctorRole.section });
            }

            const subjectRoles = faculty.allocations.filter(a => a.type === 'subject');
            if (subjectRoles.length > 0) {
                setIsSubjectRole(true);
                const newSubjectAlloc = {};
                subjectRoles.forEach(alloc => {
                    const key = `${alloc.semester}-${alloc.section}`;
                    if (!newSubjectAlloc[key]) newSubjectAlloc[key] = [];
                    newSubjectAlloc[key].push(alloc.subject);
                });
                setSubjectAlloc(newSubjectAlloc);
            }
        }
    }, [faculty]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubjectAllocChange = (sem, sec, subjects) => {
        const key = `${sem}-${sec}`;
        setSubjectAlloc(prev => ({ ...prev, [key]: subjects }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isViewMode) {
            onClose();
            return;
        }
        if (adminPassword !== 'password123') {
            alert('Incorrect admin password!');
            return;
        }
        if (!faculty && formData.password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        // Convert new allocation state back to the array format
        const newAllocations = [];
        if (isProctorRole && proctorAlloc.semester && proctorAlloc.section) {
            newAllocations.push({ type: 'proctor', ...proctorAlloc, department: 'AIML' });
        }
        if (isSubjectRole) {
            Object.entries(subjectAlloc).forEach(([key, subjects]) => {
                const [semester, section] = key.split('-');
                subjects.forEach(subject => {
                    newAllocations.push({ type: 'subject', semester: Number(semester), section, subject, department: 'AIML' });
                });
            });
        }
        
        onSave({ ...formData, id: faculty?.id || formData.ssn, allocations: newAllocations });
    };

    const semesters = ['1', '2'];
    const sections = ['A', 'B', 'C'];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
                <Card.Header className="flex justify-between items-center">
                    <Card.Title>{isViewMode ? 'View Faculty Details' : (faculty ? 'Edit Faculty' : 'Add New Faculty')}</Card.Title>
                    <Button variant="ghost" size="sm" onClick={onClose}><X className="h-5 w-5"/></Button>
                </Card.Header>
                <form onSubmit={handleSubmit} className="overflow-y-auto">
                    <Card.Content className="space-y-6">
                        {/* Personal & Professional Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div><label>Full Name</label><Input name="name" value={formData.name} onChange={handleChange} required disabled={isViewMode} /></div>
                            <div><label>SSN</label><Input name="ssn" value={formData.ssn} onChange={handleChange} required disabled={!!faculty} /></div>
                            <div>
                                <label>Designation</label>
                                <select name="designation" value={formData.designation} onChange={handleChange} disabled={isViewMode} className="w-full p-2 border rounded mt-1 bg-white h-10">
                                    {['HOD', 'Asst. HOD', 'Associate Professor', 'Asst. Professor', 'Teaching Assistant', 'Lab Technician'].map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                            <div><label>Email Address</label><Input name="email" type="email" value={formData.email} onChange={handleChange} required disabled={isViewMode} /></div>
                            <div><label>Phone Number</label><Input name="phone" value={formData.phone} onChange={handleChange} disabled={isViewMode} /></div>
                            <div><label>Qualification</label><Input name="qualification" value={formData.qualification} onChange={handleChange} disabled={isViewMode} /></div>
                            <div><label>Experience (Years)</label><Input name="experience" type="number" value={formData.experience} onChange={handleChange} disabled={isViewMode} /></div>
                            <div><label>Salary</label><Input name="salary" type="number" value={formData.salary} onChange={handleChange} disabled={isViewMode} /></div>
                        </div>

                        {/* Allocations Section */}
                        <div className="space-y-4 p-4 border rounded-lg">
                            <h4 className="font-semibold text-vidya-pink">Role Allocations</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Proctor Role Box */}
                                <div className={`p-4 border rounded-lg ${isProctorRole ? 'border-vidya-blue' : ''}`}>
                                    <div className="flex items-center mb-4">
                                        <input type="checkbox" id="proctorRole" checked={isProctorRole} onChange={() => setIsProctorRole(!isProctorRole)} disabled={isViewMode} className="h-4 w-4" />
                                        <label htmlFor="proctorRole" className="ml-2 font-medium">Assign as Proctor</label>
                                    </div>
                                    {isProctorRole && (
                                        <div className="space-y-2">
                                            <div>
                                                <label className="text-sm">Semester</label>
                                                <select value={proctorAlloc.semester} onChange={e => setProctorAlloc({...proctorAlloc, semester: e.target.value})} disabled={isViewMode} className="w-full p-2 border rounded mt-1 bg-white h-10">
                                                    <option value="">Select Sem</option>
                                                    {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-sm">Section</label>
                                                <select value={proctorAlloc.section} onChange={e => setProctorAlloc({...proctorAlloc, section: e.target.value})} disabled={isViewMode} className="w-full p-2 border rounded mt-1 bg-white h-10">
                                                    <option value="">Select Section</option>
                                                    {sections.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Subject Faculty Role Box */}
                                <div className={`p-4 border rounded-lg ${isSubjectRole ? 'border-vidya-green' : ''}`}>
                                    <div className="flex items-center mb-4">
                                        <input type="checkbox" id="subjectRole" checked={isSubjectRole} onChange={() => setIsSubjectRole(!isSubjectRole)} disabled={isViewMode} className="h-4 w-4" />
                                        <label htmlFor="subjectRole" className="ml-2 font-medium">Assign as Subject Faculty</label>
                                    </div>
                                    {isSubjectRole && (
                                        <div className="space-y-4">
                                            {semesters.map(sem => (
                                                <div key={sem}>
                                                    <h5 className="font-semibold text-sm mb-2">Semester {sem}</h5>
                                                    {sections.map(sec => {
                                                        const subjectsForSem = sem === '1' ? SEM1_SUBJECTS : SEM2_SUBJECTS;
                                                        const key = `${sem}-${sec}`;
                                                        return (
                                                            <div key={key} className="mb-2">
                                                                <label className="text-sm">Section {sec} Subjects</label>
                                                                <select multiple value={subjectAlloc[key] || []} onChange={e => handleSubjectAllocChange(sem, sec, Array.from(e.target.selectedOptions, option => option.value))} disabled={isViewMode} className="w-full p-2 border rounded mt-1 bg-white h-24">
                                                                    {subjectsForSem.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                                                </select>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Credentials */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                            <div><label>Password</label><Input name="password" type="password" value={isViewMode ? '********' : formData.password} onChange={handleChange} required={!faculty} disabled={isViewMode} placeholder={!isViewMode && faculty ? 'Leave blank to keep unchanged' : ''} /></div>
                            {!isViewMode && <div><label>Confirm Password</label><Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required={!faculty} /></div>}
                        </div>
                        
                        {!isViewMode && (
                            <div className="border-t pt-4">
                                <label>Admin Password</label>
                                <Input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} placeholder="Enter admin password to save" required/>
                            </div>
                        )}
                    </Card.Content>
                    <div className="p-4 sm:p-6 border-t flex justify-end gap-2 sticky bottom-0 bg-white">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        {!isViewMode && <Button type="submit">Save Changes</Button>}
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default FacultyFormModal;
