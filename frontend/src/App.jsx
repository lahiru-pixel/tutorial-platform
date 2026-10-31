import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Login from './pages/Login';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import Dashboard from './pages/StudentDashboard';
import CoursePage from './pages/CoursePage';
import WatchPage from './pages/WatchPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManageCourses from './pages/admin/ManageCourses';
import ManageVideos from './pages/admin/ManageVideos';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans">
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-white focus:text-secondary focus:px-4 focus:py-3 focus:rounded-lg">Skip to content</a>
          <Navbar />
          <main id="main-content" tabIndex={-1} className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Student Routes */}
              <Route path="/my-courses" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/courses/:id" element={<ProtectedRoute><CoursePage /></ProtectedRoute>} />
              <Route path="/videos/:id/watch" element={<ProtectedRoute><WatchPage /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/students" element={<AdminRoute><ManageStudents /></AdminRoute>} />
              <Route path="/admin/courses" element={<AdminRoute><ManageCourses /></AdminRoute>} />
              <Route path="/admin/videos" element={<AdminRoute><ManageVideos /></AdminRoute>} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
