import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Search, UserPlus, UserMinus } from 'lucide-react';
import api from '../services/api';

export default function CourseStudents({ course, onBack }) {
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(null);
  const [query, setQuery] = useState('');
  const [view, setView] = useState('enrolled');
  const [attempt, setAttempt] = useState(0);
  const mutationInProgress = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError('');
    Promise.all([
      api.get('/api/admin/students'),
      api.get('/api/admin/enrollments'),
    ]).then(([studentResponse, enrollmentResponse]) => {
      if (cancelled) return;
      setStudents(studentResponse.data);
      setEnrollments(enrollmentResponse.data.filter(item => item.course_id === course.id));
    }).catch(() => {
      if (!cancelled) setLoadError('Unable to load students. Please try again.');
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [course.id, attempt]);

  const enrolledIds = new Set(enrollments.map(item => item.student_id));
  const enrolledStudents = enrollments.map(item =>
    students.find(student => student.id === item.student_id) || {
      ...item.profiles,
      id: item.student_id,
    }
  );
  const availableStudents = students.filter(student => !enrolledIds.has(student.id));
  const search = query.trim().toLowerCase();
  const visibleStudents = (view === 'enrolled' ? enrolledStudents : availableStudents)
    .filter(student => `${student.name || ''} ${student.email || ''}`.toLowerCase().includes(search));

  const changeEnrollment = async (student, remove = false) => {
    if (mutationInProgress.current) return;
    if (remove && !window.confirm(`Remove ${student.name || student.email || 'this student'} from "${course.title}"?`)) return;
    mutationInProgress.current = true;
    setPending(student.id);
    setError('');
    setMessage('');
    const payload = { student_id: student.id, course_id: course.id };
    try {
      if (remove) {
        await api.delete('/api/admin/enroll', { data: payload });
        setEnrollments(current => current.filter(item => item.student_id !== student.id));
      } else {
        const { data } = await api.post('/api/admin/enroll', payload);
        setEnrollments(current => [...current, data]);
      }
      setMessage(`${student.name || student.email || 'Student'} ${remove ? 'removed from' : 'added to'} ${course.title}.`);
    } catch {
      setError(remove
        ? 'Unable to remove this student. Please try again.'
        : 'Unable to add this student. Please try again or reopen the course to refresh its enrollments.');
    } finally {
      mutationInProgress.current = false;
      setPending(null);
    }
  };

  return (
    <section aria-labelledby="course-students-title" className="space-y-6">
      <button onClick={onBack} disabled={pending !== null} className="flex items-center gap-2 text-primary hover:text-primary-hover font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </button>
      <div>
        <p className="text-sm text-muted mb-1">Manage course students</p>
        <h1 id="course-students-title" className="text-3xl font-bold text-secondary break-words">{course.title}</h1>
        <p className="text-muted mt-2">Add or remove enrollment for this course. Payment status is managed in the Students tab and applies to the student’s account.</p>
      </div>

      {loading ? <p role="status" className="text-muted">Loading students...</p> : loadError ? (
        <div role="alert" className="bg-primary/10 border border-primary/20 rounded-xl p-5">
          <p>{loadError}</p>
          <button onClick={() => setAttempt(value => value + 1)} className="mt-3 bg-primary hover:bg-primary-hover text-white rounded-lg px-4 py-2">Retry</button>
        </div>
      ) : (
        <div className="bg-surface border border-line rounded-xl overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-line space-y-4">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Student lists">
              <button onClick={() => setView('enrolled')} aria-pressed={view === 'enrolled'} className={`rounded-lg px-4 py-2 font-medium transition ${view === 'enrolled' ? 'bg-primary text-white' : 'bg-surface-muted text-secondary hover:bg-line'}`}>
                Enrolled ({enrollments.length})
              </button>
              <button onClick={() => setView('available')} aria-pressed={view === 'available'} className={`rounded-lg px-4 py-2 font-medium transition ${view === 'available' ? 'bg-primary text-white' : 'bg-surface-muted text-secondary hover:bg-line'}`}>
                Add Students ({availableStudents.length})
              </button>
            </div>
            <label htmlFor="course-student-search" className="block text-sm font-medium text-secondary">Search by name or email</label>
            <div className="relative">
              <Search aria-hidden="true" className="absolute left-3 top-3 w-5 h-5 text-muted" />
              <input id="course-student-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search students..." className="w-full bg-canvas border border-line rounded-lg pl-10 pr-4 py-2 text-ink focus:border-primary" />
            </div>
            {error && <p role="alert" className="text-primary">{error}</p>}
            <p role="status" className="text-secondary empty:hidden">{message}</p>
          </div>

          {visibleStudents.length > 0 ? (
            <ul className="divide-y divide-line">
              {visibleStudents.map(student => (
                <li key={student.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-secondary break-words">{student.name || student.email || 'Student'}</p>
                    <p className="text-sm text-muted break-all">{student.email}</p>
                    <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${student.is_paid ? 'bg-emerald-500/10 text-emerald-700' : 'bg-primary/10 text-primary'}`}>
                      {student.is_paid ? 'Paid account' : 'Unpaid account'}
                    </span>
                  </div>
                  <button
                    onClick={() => changeEnrollment(student, view === 'enrolled')}
                    disabled={pending !== null}
                    aria-label={`${view === 'enrolled' ? 'Remove' : 'Enroll'} ${student.name || student.email || 'student'}`}
                    className={`shrink-0 flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${view === 'enrolled' ? 'border border-primary/20 text-primary hover:bg-primary/10' : 'bg-primary hover:bg-primary-hover text-white'}`}
                  >
                    {view === 'enrolled' ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    {pending === student.id ? 'Saving...' : view === 'enrolled' ? 'Remove from Course' : 'Enroll in Course'}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-8 text-center text-muted">
              {search ? 'No students match your search.' : view === 'enrolled' ? 'No students enrolled yet. Choose Add Students to enroll someone.' : students.length === 0 ? 'No student accounts registered yet.' : 'All registered students are already enrolled in this course.'}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
