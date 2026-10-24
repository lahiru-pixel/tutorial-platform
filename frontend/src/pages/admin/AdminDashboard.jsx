import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Users, BookOpen, PlayCircle, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total_students: 0, total_paid: 0, total_courses: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/dashboard')
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-muted">Loading admin stats...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto w-full flex-1 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <div className="w-full md:w-64 space-y-2">
        <div className="bg-surface rounded-xl p-4 border border-line">
          <h3 className="font-bold text-secondary uppercase text-xs tracking-wider mb-4">Admin Menu</h3>
          <nav className="space-y-1">
            <Link to="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-white transition">
              <DollarSign className="w-5 h-5" /> Dashboard
            </Link>
            <Link to="/admin/students" className="flex items-center gap-3 px-3 py-2 rounded-lg text-ink hover:bg-surface-muted transition">
              <Users className="w-5 h-5" /> Manage Students
            </Link>
            <Link to="/admin/courses" className="flex items-center gap-3 px-3 py-2 rounded-lg text-ink hover:bg-surface-muted transition">
              <BookOpen className="w-5 h-5" /> Manage Courses
            </Link>
            <Link to="/admin/videos" className="flex items-center gap-3 px-3 py-2 rounded-lg text-ink hover:bg-surface-muted transition">
              <PlayCircle className="w-5 h-5" /> Manage Videos
            </Link>
          </nav>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-6 text-secondary">Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface rounded-xl p-6 border border-line flex items-center gap-4">
            <div className="bg-primary/20 p-4 rounded-lg">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-muted text-sm">Total Students</p>
              <h3 className="text-3xl font-bold text-secondary">{stats.total_students}</h3>
            </div>
          </div>
          
          <div className="bg-surface rounded-xl p-6 border border-line flex items-center gap-4">
            <div className="bg-secondary/10 p-4 rounded-lg">
              <DollarSign className="w-8 h-8 text-secondary" />
            </div>
            <div>
              <p className="text-muted text-sm">Paid Students</p>
              <h3 className="text-3xl font-bold text-secondary">{stats.total_paid}</h3>
            </div>
          </div>
          
          <div className="bg-surface rounded-xl p-6 border border-line flex items-center gap-4">
            <div className="bg-primary/10 p-4 rounded-lg">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-muted text-sm">Total Courses</p>
              <h3 className="text-3xl font-bold text-secondary">{stats.total_courses}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
