// src/data/mockData.js
import { faker } from '@faker-js/faker';
faker.seed(45123);

const DEPARTMENTS = {
    AIML: { name: 'AIML', semesters: [1, 2] },
    CSE: { name: 'CSE', semesters: [1, 2, 3, 4, 5, 6, 7, 8] },
    ECE: { name: 'ECE', semesters: [1, 2, 3, 4, 5, 6, 7, 8] },
};

const SEM1_SUBJECTS = ['Calculus & Linear Algebra', 'Engineering Physics', 'Basic Electrical Engineering', 'Elements of Civil Engineering', 'Engineering Graphics'];
const SEM2_SUBJECTS = ['Advanced Calculus & Numerical Methods', 'Engineering Chemistry', 'Problem-Solving through Programming', 'Basic Electronics & Communication', 'Mechanical Engineering'];
const ALL_SUBJECTS = [...new Set([...SEM1_SUBJECTS, ...SEM2_SUBJECTS])];
const FEW_SUBJECTS = ['Calculus & Linear Algebra', 'Engineering Physics', 'Problem-Solving through Programming', 'Database Systems', 'Data Structures', 'Algorithms'];


const maxMarks = { ia1: 20, ia2: 20, quiz: 10, aat: 20, total: 70 };

const createStudentPerformance = (semester, scoreBias = 'normal') => {
    const performance = {};
    const subjectsForSem = semester === 1 ? SEM1_SUBJECTS : SEM2_SUBJECTS;
    subjectsForSem.forEach(subject => {
        let minMark = 5;
        if (scoreBias === 'high') minMark = 15;
        if (scoreBias === 'low') minMark = 2;

        const ia1 = faker.number.int({ min: minMark, max: maxMarks.ia1 });
        const ia2 = faker.number.int({ min: minMark, max: maxMarks.ia2 });
        const quiz = faker.number.int({ min: Math.floor(minMark/2), max: maxMarks.quiz });
        const aat = faker.number.int({ min: Math.floor(minMark*0.8), max: maxMarks.aat });
        performance[subject] = {
            ia1,
            ia2,
            quiz,
            aat,
            total: ia1 + ia2 + quiz + aat,
            attendance: {
                present: faker.number.int({ min: 12, max: 20 }),
                total: 20,
            }
        };
    });
    return performance;
};

const createAdminStudent = (usn, department, semester, section, bias) => {
    const isHosteller = faker.datatype.boolean();
    const transport = isHosteller ? 'N/A' : faker.helpers.arrayElement(['Day Scholar - Bus', 'Day Scholar - Own Vehicle']);
    
    const admissionFee = { applicable: true, amount: 85000, paid: faker.datatype.boolean() };
    const examFee = { applicable: true, amount: 1500, paid: faker.datatype.boolean() };
    const hostelFee = { applicable: isHosteller, amount: 75000, paid: isHosteller ? faker.datatype.boolean() : false };
    const busFee = { applicable: transport === 'Day Scholar - Bus', amount: 15000, paid: transport === 'Day Scholar - Bus' ? faker.datatype.boolean() : false };

    const totalFees = (admissionFee.amount) + (examFee.amount) + (hostelFee.applicable ? hostelFee.amount : 0) + (busFee.applicable ? busFee.amount : 0);
    const feesPaid = (admissionFee.paid ? admissionFee.amount : 0) + (examFee.paid ? examFee.amount : 0) + (hostelFee.paid ? hostelFee.amount : 0) + (busFee.paid ? busFee.amount : 0);

    const performance = createStudentPerformance(semester, bias);
    const overallAvg = Object.values(performance).reduce((acc, p) => acc + (p.total / maxMarks.total), 0) / Object.keys(performance).length;

    return {
        id: usn,
        password: 'password123',
        name: faker.person.fullName(),
        usn,
        phone: faker.phone.number(),
        fatherName: faker.person.fullName({ sex: 'male' }),
        fatherPhone: faker.phone.number(),
        semester,
        department,
        section,
        email: faker.internet.email().toLowerCase(),
        seatAllotment: faker.helpers.arrayElement(['KCET', 'Management', 'COMED-K']),
        accommodation: isHosteller ? 'Hosteller' : 'Day Scholar',
        transport: transport,
        fees: {
            admission: admissionFee,
            hostel: hostelFee,
            bus: busFee,
            exam: examFee,
            total: totalFees,
            paid: feesPaid,
            remaining: totalFees - feesPaid,
        },
        performance,
        passed: overallAvg > 0.4,
    };
};

const createAdminFaculty = (ssn, name, department, designation) => ({
    id: ssn,
    password: 'password123',
    ssn,
    name,
    department,
    designation,
    email: faker.internet.email().toLowerCase(),
    phone: faker.phone.number(),
    qualification: faker.helpers.arrayElement(['M.Tech', 'PhD', 'M.Sc']),
    experience: faker.number.int({ min: 2, max: 15 }),
    salary: faker.finance.amount({min: 600000, max: 1500000, dec:0}),
    allocations: {
        roles: faker.helpers.arrayElements(['Subject Faculty', 'Proctor'], {min: 1, max: 2}),
        semesters: faker.helpers.arrayElements(['1','2'], {min: 1, max: 2}),
        sections: faker.helpers.arrayElements(['A','B', 'C'], {min: 1, max: 3}),
        subjects: faker.helpers.arrayElements(ALL_SUBJECTS, {min: 2, max: 4}),
    }
});


// --- GENERATE MOCK DATA FOR ADMIN ---
const aimlStudents = Array.from({ length: 60 }, (_, i) => {
    const semester = faker.helpers.arrayElement([1, 2]);
    const section = faker.helpers.arrayElement(['A', 'B', 'C']);
    const bias = i % 3 === 0 ? 'high' : (i % 3 === 1 ? 'normal' : 'low'); // Distribute performance
    return createAdminStudent(`1VA${23-semester}AIML${String(i + 1).padStart(3, '0')}`, 'AIML', semester, section, bias);
});

const aimlFaculty = [
    createAdminFaculty('FHODAIML001', 'Dr. Patsy Botsford', 'AIML', 'HOD'),
    createAdminFaculty('FAIML001', 'Dr. Alfonzo Waelchi', 'AIML', 'Associate Professor'),
    createAdminFaculty('FAIML002', 'Dr. Linwood Bartoletti', 'AIML', 'Asst. Professor'),
    createAdminFaculty('FAIML003', 'Dr. Eudora Konopelski', 'AIML', 'Asst. Professor'),
    createAdminFaculty('FAIML004', 'Dr. Marianne Marvin', 'AIML', 'Associate Professor'),
    createAdminFaculty('FAIML005', 'Dr. Aurelie Waelchi', 'AIML', 'Associate Professor'),
];

// --- MAIN USER FOR STUDENT LOGIN ---
const studentUser = {
    id: '1MS21CS001',
    name: 'Aarav Sharma',
    usn: '1MS21CS001',
    email: 'aarav.sharma@vidyamitra.com',
    password: 'password123',
    role: 'student',
    department: 'AIML',
    section: 'A',
    semester: 1,
    phone: '9876543210',
    fatherName: 'Rajesh Sharma',
    fatherPhone: '9876543211',
    seatAllotment: 'KCET',
    accommodation: 'Day Scholar',
    transport: 'Day Scholar - Bus',
    fees: {
        admission: { applicable: true, amount: 85000, paid: true },
        hostel: { applicable: false, amount: 75000, paid: false },
        bus: { applicable: true, amount: 15000, paid: true },
        exam: { applicable: true, amount: 1500, paid: true },
        total: 85000 + 15000 + 1500,
        paid: 85000 + 15000 + 1500,
        remaining: 0,
    },
    performance: createStudentPerformance(1, 'high'), // Ensure performance matches semester
    classAverage: {
        'Calculus & Linear Algebra': 77, 'Engineering Physics': 70, 'Basic Electrical Engineering': 88, 'Elements of Civil Engineering': 75, 'Engineering Graphics': 82,
    },
    overallAttendance: 82,
};
// Add studentUser to the main list to be found by faculty
aimlStudents.unshift(studentUser);


// --- MAIN USER FOR FACULTY LOGIN ---
const facultyUser = {
    id: 'F001',
    ssn: 'F001',
    name: 'Dr. Evelyn Reed',
    department: 'AIML',
    designation: 'Asst. Professor',
    email: 'evelyn.reed@vidyamitra.com',
    password: 'password123',
    role: 'faculty',
    allocations: [
        { type: 'proctor', section: 'A', semester: 1, department: 'AIML' },
        { type: 'subject', subject: 'Calculus & Linear Algebra', section: 'A', semester: 1, department: 'AIML' },
        { type: 'subject', subject: 'Engineering Physics', section: 'B', semester: 1, department: 'AIML' },
    ]
};
// Add facultyUser to the main list
aimlFaculty.unshift(facultyUser);


export const users = [
    { id: 'admin', name: 'Admin User', email: 'admin@vidyamitra.com', password: 'password123', role: 'admin' },
    ...aimlFaculty.map(f => ({ ...f, role: 'faculty' })),
    ...aimlStudents.map(s => ({ ...s, role: 'student' })),
];

const totalFeesPaid = aimlStudents.reduce((acc, s) => acc + s.fees.paid, 0);
const totalFeesRemaining = aimlStudents.reduce((acc, s) => acc + s.fees.remaining, 0);

export let db = {
    departments: {
        AIML: {
            students: aimlStudents,
            faculty: aimlFaculty,
            overview: {
                totalStudents: aimlStudents.length,
                totalFaculty: aimlFaculty.length,
                feesPaid: totalFeesPaid,
                feesRemaining: totalFeesRemaining,
            }
        },
        CSE: { students: [], faculty: [], overview: { totalStudents: 0, totalFaculty: 0, feesPaid: 0, feesRemaining: 0 } },
        ECE: { students: [], faculty: [], overview: { totalStudents: 0, totalFaculty: 0, feesPaid: 0, feesRemaining: 0 } },
    },
    departmentEvents: {
        AIML: [
            { id: 1, name: 'AI & Future Tech Summit', date: '2025-08-15' },
            { id: 2, name: 'Annual Codefest', date: '2025-09-20' },
        ]
    },
    studyResources: {
        'Calculus & Linear Algebra': { 'Vectors': [{ type: 'Video', title: 'Intro to Vectors', duration: '30 min' }] },
        'Engineering Physics': { 'Optics': [{ type: 'Document', title: 'Lens Formula', pages: 5 }] },
        'Problem-Solving through Programming': { 'Loops': [{ type: 'Video', title: 'For vs While', duration: '25 min' }] },
        'Database Systems': {
            'SQL Fundamentals': [{ type: 'Video', title: 'Intro to SQL', duration: '45 min' }, { type: 'Document', title: 'SQL Cheat Sheet', pages: 2 }],
            'Database Design': [{ type: 'Video', title: 'Database Design and Normalization', duration: '55 min' }, { type: 'Document', title: 'ER Diagram Tutorial', pages: 15 }],
        },
        'Data Structures': { 'Arrays': [{ type: 'Document', title: 'Array Operations', pages: 10 }] },
        'Algorithms': { 'Sorting': [{ type: 'Video', title: 'Bubble Sort Explained', duration: '15 min' }] },
    }, // ✅ Fixed: Removed stray 't' here
    notifications: [
        { id: 1, priority: 'high', title: 'Weak Subject Alert', message: 'Your performance needs improvement.', time: '2 hours ago', sender: 'Dr. Evelyn Reed (Proctor)', subject: 'Database Systems' },
        { id: 2, priority: 'medium', title: 'Upcoming Assessment', message: 'Internal exam scheduled for tomorrow at 10:00 AM', time: '5 hours ago', sender: 'Dr. Alan Grant', subject: 'Data Structures' },
    ],

    // ✅ --- START OF CHANGES ---
    summaries: [
        { 
            date: '2025-10-01', 
            subject: 'Data Structures', 
            topic: 'Arrays',
            content: 'Studied array: Arrays are fundamental data structures used to store a collection of elements of the same data type in contiguous memory locations. They provide direct access to elements using an index, enabling efficient retrieval and modification. Understanding arrays is crucial for building more complex data structures and algorithms, making them a core concept in computer science. Arrays are characterized by their fixed size (unless dynamic arrays are used), element type, and the ability to access elements using their index.'
        },
        { 
            date: '2025-09-30', 
            subject: 'Database Systems', 
            topic: 'Normalization (1NF, 2NF)',
            content: 'Revised concepts of Normalization. 1NF ensures atomic values in each cell. 2NF builds on 1NF and requires that all non-key attributes be fully functionally dependent on the primary key. This eliminates partial dependencies. Practiced converting unnormalized tables to 2NF.'
        },
        { 
            date: '2025-09-29', 
            subject: 'Machine Learning', 
            topic: 'Linear Regression',
            content: 'Learned the basics of Linear Regression. It is a supervised learning algorithm used for predicting a continuous dependent variable based on one or more independent variables. The goal is to find the best-fit line (hyperplane) that minimizes the sum of squared errors (cost function). Key concepts include coefficients, intercept, and gradient descent for optimization.'
        },
        { 
            date: '2025-09-28', 
            subject: 'Data Structures', 
            topic: 'Linked Lists',
            content: 'Covered single linked lists. Each node contains data and a pointer (or link) to the next node in the sequence. The last node points to null. Operations include insertion (at head, tail, or middle), deletion, and traversal. Unlike arrays, linked lists are dynamic in size but do not allow for direct (O(1)) access to elements.'
        },
        { 
            date: '2025-09-27', 
            subject: 'Artificial Intelligence', 
            topic: 'Search Algorithms (BFS, DFS)',
            content: 'Studied uninformed search strategies. Breadth-First Search (BFS) explores the search tree layer by layer, using a queue. It is complete and optimal for unweighted graphs. Depth-First Search (DFS) explores as far as possible along one branch before backtracking, using a stack. It is not necessarily optimal but is very memory efficient.'
        },
    ]
    // ✅ --- END OF CHANGES ---
};

// --- Mock DB Functions ---
export const addOrUpdateStudent = (department, studentData) => {
    const dept = db.departments[department];
    if (!dept) return;
    const studentIndex = dept.students.findIndex(s => s.id === studentData.id);
    const userIndex = users.findIndex(u => u.id === studentData.id);

    if (studentIndex > -1) {
        dept.students[studentIndex] = { ...dept.students[studentIndex], ...studentData };
        if (userIndex > -1) users[userIndex] = { ...users[userIndex], ...studentData };
    } else {
        const newStudent = {
            ...createAdminStudent(studentData.usn, department, studentData.semester, studentData.section, 'normal'),
            ...studentData,
            id: studentData.usn,
            performance: createStudentPerformance(parseInt(studentData.semester, 10)),
        };
        dept.students.push(newStudent);
        users.push({ ...newStudent, role: 'student' });
    }
};

export const addOrUpdateFaculty = (department, facultyData) => {
    const dept = db.departments[department];
    if (!dept) return;
    const facultyIndex = dept.faculty.findIndex(f => f.id === facultyData.id);
    const userIndex = users.findIndex(u => u.id === facultyData.id);

    if (facultyIndex > -1) {
        dept.faculty[facultyIndex] = { ...dept.faculty[facultyIndex], ...facultyData };
        if (userIndex > -1) users[userIndex] = { ...users[userIndex], ...facultyData };
    } else {
        const newFaculty = {
            ...createAdminFaculty(facultyData.ssn, facultyData.name, department, facultyData.designation),
            ...facultyData,
            id: facultyData.ssn,
        };
        dept.faculty.push(newFaculty);
        users.push({ ...newFaculty, role: 'faculty' });
    }
};

export const addDepartmentEvent = (department, eventData) => {
    if (!db.departmentEvents[department]) {
        db.departmentEvents[department] = [];
    }
    db.departmentEvents[department].push({ ...eventData, id: Date.now() });
};


export { ALL_SUBJECTS as subjects, maxMarks, SEM1_SUBJECTS, SEM2_SUBJECTS, FEW_SUBJECTS };