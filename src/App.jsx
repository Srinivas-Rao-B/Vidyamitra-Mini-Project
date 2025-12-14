import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

import Landing from './pages/Landing';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import NotFound from './pages/NotFound';
import DepartmentSelect from './pages/admin/DepartmentSelect';
import ManageStudents from './pages/admin/ManageStudents';
import ManageFaculty from './pages/admin/ManageFaculty';
import StudentAttendance from './pages/student/Attendance';
import StudyResources from './pages/student/StudyResources';
import ThreeRSystem from './pages/student/ThreeRSystem';
import StudyPlanner from './pages/student/StudyPlanner';
import Notifications from './pages/student/Notifications';
import AdminLayout from './components/layout/AdminLayout';

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (user.role !== role) {
    // For faculty/student trying to access admin pages or vice-versa
    return <Navigate to={`/${user.role}/dashboard`} />;
  }
  return children;
}

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={user ? <Navigate to={`/${user.role}/dashboard`} /> : <Login />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><DepartmentSelect /></ProtectedRoute>} />
      <Route element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route path="/admin/:department/overview" element={<AdminDashboard />} />
        <Route path="/admin/:department/students" element={<ManageStudents />} />
        <Route path="/admin/:department/faculty" element={<ManageFaculty />} />
      </Route>

      {/* Faculty Routes */}
      <Route path="/faculty/dashboard" element={<ProtectedRoute role="faculty"><FacultyDashboard /></ProtectedRoute>} />

      {/* Student Routes */}
      <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/attendance" element={<ProtectedRoute role="student"><StudentAttendance /></ProtectedRoute>} />
      <Route path="/student/resources" element={<ProtectedRoute role="student"><StudyResources /></ProtectedRoute>} />
      <Route path="/student/3r-summary" element={<ProtectedRoute role="student"><ThreeRSystem /></ProtectedRoute>} />
      <Route path="/student/planner" element={<ProtectedRoute role="student"><StudyPlanner /></ProtectedRoute>} />
      <Route path="/student/notifications" element={<ProtectedRoute role="student"><Notifications /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
