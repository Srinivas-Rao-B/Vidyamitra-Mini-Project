import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { X } from 'lucide-react';

const DetailItem = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-vidya-gray-500">{label}</p>
        <p className="text-md text-vidya-gray-900">{value}</p>
    </div>
);

const StudentInfoModal = ({ user, onClose }) => {
    if (!user) return null;

    const { fees, performance } = user;
    const subjects = performance ? Object.keys(performance) : [];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-3xl max-h-[90vh] flex flex-col">
                <Card.Header className="flex justify-between items-center">
                    <Card.Title>Student Information</Card.Title>
                    <Button variant="ghost" size="sm" onClick={onClose}><X className="h-5 w-5"/></Button>
                </Card.Header>
                <div className="overflow-y-auto">
                    <Card.Content className="space-y-6">
                        <section>
                            <h4 className="text-lg font-semibold text-vidya-pink mb-3 border-b pb-2">Personal Details</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <DetailItem label="Name" value={user.name} />
                                <DetailItem label="Email" value={user.email} />
                                <DetailItem label="Phone" value={user.phone || 'N/A'} />
                                <DetailItem label="Father's Name" value={user.fatherName || 'N/A'} />
                                <DetailItem label="Father's Phone" value={user.fatherPhone || 'N/A'} />
                            </div>
                        </section>

                        <section>
                            <h4 className="text-lg font-semibold text-vidya-pink mb-3 border-b pb-2">Academic Details</h4>
                             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <DetailItem label="USN" value={user.usn} />
                                <DetailItem label="Department" value={`${user.department} - Section ${user.section}`} />
                                <DetailItem label="Semester" value={user.semester} />
                                <DetailItem label="Seat Allotment" value={user.seatAllotment || 'N/A'} />
                            </div>
                        </section>
                        
                        <section>
                            <h4 className="text-lg font-semibold text-vidya-pink mb-3 border-b pb-2">Fee & Accommodation</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <DetailItem label="Accommodation" value={user.accommodation} />
                                {user.accommodation === 'Day Scholar' && <DetailItem label="Transport" value={user.transport} />}
                                <DetailItem label="Total Fees" value={`₹${(fees?.total || 0).toLocaleString('en-IN')}`} />
                                <DetailItem label="Fees Paid" value={`₹${(fees?.paid || 0).toLocaleString('en-IN')}`} />
                                <DetailItem label="Remaining Fees" value={`₹${(fees?.remaining || 0).toLocaleString('en-IN')}`} />
                            </div>
                        </section>

                        <section>
                            <h4 className="text-lg font-semibold text-vidya-pink mb-3 border-b pb-2">Enrolled Subjects</h4>
                            <div className="flex flex-wrap gap-2">
                                {subjects.map(sub => (
                                    <span key={sub} className="bg-vidya-light-pink text-vidya-dark-pink text-sm font-medium px-3 py-1 rounded-full">{sub}</span>
                                ))}
                            </div>
                        </section>
                    </Card.Content>
                </div>
            </Card>
        </div>
    );
};

export default StudentInfoModal;
