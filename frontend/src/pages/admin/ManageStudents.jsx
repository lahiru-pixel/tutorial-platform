import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Users, DollarSign, BookOpen, PlayCircle, PlusCircle, Trash2 } from 'lucide-react';

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  const fetchData = () => {
    Promise.all([
      api.get('/api/admin/students'),
      api.get('/api/admin/courses'),
      api.get('/api/admin/enrollments')
    ]).then(([sRes, cRes, eRes]) => {
      setStudents(sRes.data);
      setCourses(cRes.data);
      setEnrollments(eRes.data);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const togglePaid = async (id, currentStatus) => {
    try {
      await api.put(`/api/admin/students/${id}/pay`, { is_paid: !currentStatus });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to update student');
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedCourse) return;
    try {
      await api.post('/api/admin/enroll', { student_id: selectedStudent, course_id: selectedCourse });
      fetchData();
      setSelectedStudent('');
      setSelectedCourse('');
    } catch (err) {
      console.error(err);
      alert('Failed to enroll student. They might already be enrolled.');
    }
  };

  const removeEnrollment = async (student_id, course_id) => {
    if (!confirm('Remove enrollment?')) return;
    try {
      await api.delete('/api/admin/enroll', { data: { student_id, course_id } });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to remove enrollment');
    }
  };

  if (loading) return <div className="p-8 text-center text-muted">Loading...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto w-full flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <div className="w-full md:w-64 space-y-2">
        <div className="bg-surface rounded-xl p-4 border border-line">
          <h3 className="font-bold text-secondary uppercase text-xs tracking-wider mb-4">Admin Menu</h3>
          <nav className="space-y-1">
            <Link to="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg text-ink hover:bg-surface-muted transition">
              <DollarSign className="w-5 h-5" /> Dashboard
            </Link>
            <Link to="/admin/students" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-white transition">
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
      <div className="flex-1 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-6 text-secondary">Students</h1>
          <div className="bg-surface rounded-xl border border-line overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-canvas/50 border-b border-line">
                <tr>
                  <th className="p-4 font-semibold text-ink">Name</th>
                  <th className="p-4 font-semibold text-ink">Email</th>
                  <th className="p-4 font-semibold text-ink">Status</th>
                  <th className="p-4 font-semibold text-ink text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {students.map(student => (
                  <tr key={student.id} className="hover:bg-surface-muted/30 transition">
                    <td className="p-4 text-ink font-medium">{student.name || 'N/A'}</td>
                    <td className="p-4 text-muted">{student.email}</td>
                    <td className="p-4">
                      {student.is_paid ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">Paid</span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">Unpaid</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => togglePaid(student.id, student.is_paid)}
                        className={`text-sm px-3 py-1.5 rounded transition border ${student.is_paid ? 'bg-surface-muted border-line-strong hover:bg-line text-ink' : 'bg-primary border-primary hover:bg-primary-hover text-white'}`}
                      >
                        {student.is_paid ? 'Revoke Paid' : 'Mark Paid'}
                      </button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-muted">No students registered yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-6 text-secondary">Enrollments</h2>
          
          <div className="bg-surface rounded-xl p-6 border border-line mb-6">
            <h3 className="text-lg font-semibold mb-4 text-secondary">Manual Enrollment</h3>
            <form onSubmit={handleEnroll} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-muted mb-1">Select Student</label>
                <select 
                  className="w-full bg-canvas border border-line rounded-lg px-4 py-2 text-ink outline-none focus:border-primary"
                  value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} required
                >
                  <option value="">-- Choose Student --</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name || s.email}</option>)}
                </select>
              </div>
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-muted mb-1">Select Course</label>
                <select 
                  className="w-full bg-canvas border border-line rounded-lg px-4 py-2 text-ink outline-none focus:border-primary"
                  value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} required
                >
                  <option value="">-- Choose Course --</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition h-[42px]">
                <PlusCircle className="w-4 h-4" /> Enroll
              </button>
            </form>
          </div>
          
          <div className="bg-surface rounded-xl border border-line overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-canvas/50 border-b border-line">
                <tr>
                  <th className="p-4 font-semibold text-ink">Student</th>
                  <th className="p-4 font-semibold text-ink">Course</th>
                  <th className="p-4 font-semibold text-ink">Enrolled At</th>
                  <th className="p-4 font-semibold text-ink text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {enrollments.map(e => (
                  <tr key={e.id} className="hover:bg-surface-muted/30 transition">
                    <td className="p-4 text-ink font-medium">{e.profiles?.name || e.profiles?.email}</td>
                    <td className="p-4 text-ink">{e.courses?.title}</td>
                    <td className="p-4 text-muted text-sm">{new Date(e.enrolled_at).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => removeEnrollment(e.student_id, e.course_id)} className="text-primary hover:text-primary-hover hover:bg-primary/20 p-2 rounded transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {enrollments.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-muted">No enrollments yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
