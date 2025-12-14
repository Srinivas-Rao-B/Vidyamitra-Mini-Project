import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { X } from 'lucide-react';
import { SEM1_SUBJECTS, SEM2_SUBJECTS } from '../../data/mockData';

const StudentFormModal = ({ student, onClose, onSave, isViewMode }) => {
    const initialData = {
        name: '', usn: '', phone: '', fatherName: '', fatherPhone: '', semester: '1', section: 'A', email: '', seatAllotment: 'KCET',
        accommodation: 'Day Scholar', transport: 'Day Scholar - Own Vehicle', password: '',
        fees: {
            admission: { applicable: true, amount: 85000, paid: false },
            exam: { applicable: true, amount: 1500, paid: false },
            hostel: { applicable: false, amount: 75000, paid: false },
            bus: { applicable: false, amount: 15000, paid: false },
            total: 86500, paid: 0, remaining: 86500,
        }
    };
    const [formData, setFormData] = useState(student ? JSON.parse(JSON.stringify(student)) : initialData);
    const [adminPassword, setAdminPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const { total, paid } = formData.fees;
        setFormData(prev => ({
            ...prev,
            fees: { ...prev.fees, remaining: Number(total) - Number(paid) }
        }));
    }, [formData.fees.total, formData.fees.paid]);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('fees.')) {
            const path = name.split('.');
            const fee = path[1];
            const prop = path[2];
            setFormData(prev => ({ ...prev, fees: { ...prev.fees, [fee]: { ...prev.fees[fee], [prop]: type === 'checkbox' ? checked : value } } }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    
    const handleAccommodationChange = (e) => {
        const accommodation = e.target.value;
        const isHosteller = accommodation === 'Hosteller';
        setFormData(prev => ({
            ...prev,
            accommodation,
            transport: isHosteller ? 'N/A' : 'Day Scholar - Own Vehicle',
            fees: {
                ...prev.fees,
                hostel: { ...prev.fees.hostel, applicable: isHosteller },
                bus: { ...prev.fees.bus, applicable: false },
            }
        }));
    };

    const handleTransportChange = (e) => {
        const transport = e.target.value;
        setFormData(prev => ({
            ...prev,
            transport,
            fees: {
                ...prev.fees,
                bus: { ...prev.fees.bus, applicable: transport === 'Day Scholar - Bus' },
            }
        }));
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
        if (!student && formData.password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        onSave({ ...formData, id: student?.id || formData.usn });
    };
    
    const enrolledSubjects = formData.semester === '1' ? SEM1_SUBJECTS : SEM2_SUBJECTS;

    const renderField = (label, name, options) => (
        <div>
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <select name={name} value={formData[name]} onChange={handleChange} disabled={isViewMode} className="w-full p-2 border rounded mt-1 bg-white h-10">
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );

    const renderFeeCheckbox = (label, name) => (
        <div className="flex items-center gap-2">
            <input type="checkbox" name={`fees.${name}.applicable`} checked={formData.fees[name]?.applicable || false} onChange={handleChange} disabled={isViewMode || (name === 'hostel' && formData.accommodation !== 'Hosteller') || (name === 'bus' && formData.accommodation === 'Hosteller')} id={`check-${name}`} />
            <label htmlFor={`check-${name}`}>{label}</label>
        </div>
    );
    
    const renderFeeInput = (name) => (
        <div className="flex items-center gap-2">
            <Input type="number" name={`fees.${name}.amount`} value={formData.fees[name]?.amount || ''} onChange={handleChange} disabled={isViewMode || !formData.fees[name]?.applicable} placeholder="Amount" />
            <div className="flex items-center gap-1"><input type="checkbox" name={`fees.${name}.paid`} checked={formData.fees[name]?.paid || false} onChange={handleChange} disabled={isViewMode || !formData.fees[name]?.applicable} id={`paid-${name}`}/><label htmlFor={`paid-${name}`}>Paid</label></div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
                <Card.Header className="flex justify-between items-center">
                    <Card.Title>{isViewMode ? 'View Student Details' : (student ? 'Edit Student' : 'Add New Student')}</Card.Title>
                    <Button variant="ghost" size="sm" onClick={onClose}><X className="h-5 w-5"/></Button>
                </Card.Header>
                <form onSubmit={handleSubmit} className="overflow-y-auto">
                    <Card.Content className="space-y-6">
                        <section>
                            <h4 className="font-semibold text-vidya-pink mb-2">Personal Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div><label>Full Name</label><Input name="name" value={formData.name} onChange={handleChange} required disabled={isViewMode} /></div>
                                <div><label>Email Address</label><Input name="email" type="email" value={formData.email} onChange={handleChange} disabled={isViewMode} /></div>
                                <div><label>Phone Number</label><Input name="phone" value={formData.phone} onChange={handleChange} disabled={isViewMode} /></div>
                                <div><label>Father's Name</label><Input name="fatherName" value={formData.fatherName} onChange={handleChange} disabled={isViewMode} /></div>
                                <div><label>Father's Phone</label><Input name="fatherPhone" value={formData.fatherPhone} onChange={handleChange} disabled={isViewMode} /></div>
                            </div>
                        </section>
                        <section>
                            <h4 className="font-semibold text-vidya-pink mb-2">Academic Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div><label>USN</label><Input name="usn" value={formData.usn} onChange={handleChange} required disabled={!!student} /></div>
                                {renderField('Semester', 'semester', ['1', '2'])}
                                {renderField('Section', 'section', ['A', 'B', 'C'])}
                                {renderField('Seat Allotment', 'seatAllotment', ['KCET', 'Management', 'COMED-K'])}
                            </div>
                            <div className="mt-4">
                                <h5 className="font-medium">Enrolled Subjects</h5>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {enrolledSubjects.map(s => <span key={s} className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">{s}</span>)}
                                </div>
                            </div>
                        </section>
                        <section>
                            <h4 className="font-semibold text-vidya-pink mb-2">Fees & Services</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Accommodation</label>
                                    <select name="accommodation" value={formData.accommodation} onChange={handleAccommodationChange} disabled={isViewMode} className="w-full p-2 border rounded mt-1 bg-white h-10">
                                        <option value="Day Scholar">Day Scholar</option>
                                        <option value="Hosteller">Hosteller</option>
                                    </select>
                                </div>
                                {formData.accommodation === 'Day Scholar' && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Transport</label>
                                        <select name="transport" value={formData.transport} onChange={handleTransportChange} disabled={isViewMode} className="w-full p-2 border rounded mt-1 bg-white h-10">
                                            <option value="Day Scholar - Own Vehicle">Own Vehicle</option>
                                            <option value="Day Scholar - Bus">Bus</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4 p-4 border rounded-lg">
                                <div className="md:col-span-2 grid grid-cols-2 gap-4 items-center">
                                    <div>{renderFeeCheckbox('Admission Fee', 'admission')}</div>
                                    <div className={formData.fees.admission.applicable ? '' : 'opacity-50'}>{renderFeeInput('admission')}</div>
                                </div>
                                <div className="md:col-span-2 grid grid-cols-2 gap-4 items-center">
                                    <div>{renderFeeCheckbox('Exam Fee', 'exam')}</div>
                                    <div className={formData.fees.exam.applicable ? '' : 'opacity-50'}>{renderFeeInput('exam')}</div>
                                </div>
                                <div className="md:col-span-2 grid grid-cols-2 gap-4 items-center">
                                    <div>{renderFeeCheckbox('Hostel Fee', 'hostel')}</div>
                                    <div className={formData.fees.hostel.applicable ? '' : 'opacity-50'}>{renderFeeInput('hostel')}</div>
                                </div>
                                <div className="md:col-span-2 grid grid-cols-2 gap-4 items-center">
                                    <div>{renderFeeCheckbox('Bus Fee', 'bus')}</div>
                                    <div className={formData.fees.bus.applicable ? '' : 'opacity-50'}>{renderFeeInput('bus')}</div>
                                </div>
                                <div className="md:col-span-2 grid grid-cols-3 gap-4 border-t pt-4 mt-2">
                                    <div><label>Total Fees (₹)</label><Input name="fees.total" value={formData.fees.total} onChange={handleChange} disabled={isViewMode} /></div>
                                    <div><label>Fees Paid (₹)</label><Input name="fees.paid" value={formData.fees.paid} onChange={handleChange} disabled={isViewMode} /></div>
                                    <div><label>Remaining (₹)</label><Input value={formData.fees.remaining} disabled /></div>
                                </div>
                            </div>
                        </section>
                        <section className="border-t pt-4">
                            <h4 className="font-semibold text-vidya-pink mb-2">Credentials</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label>Password</label><Input name="password" type="password" value={formData.password} onChange={handleChange} required={!student} disabled={isViewMode} placeholder={isViewMode ? '********' : (student ? 'Leave blank to keep unchanged' : '')} /></div>
                                {!isViewMode && <div><label>Confirm Password</label><Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required={!student} /></div>}
                            </div>
                        </section>
                        {!isViewMode && (
                            <section className="border-t pt-4">
                                <label>Admin Password</label>
                                <Input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} placeholder="Enter admin password to save" required/>
                            </section>
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

export default StudentFormModal;
