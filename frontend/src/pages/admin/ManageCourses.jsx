import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Users, DollarSign, BookOpen, PlayCircle, PlusCircle, Trash2, Edit2 } from 'lucide-react';

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  const fetchCourses = () => {
    api.get('/api/admin/courses')
      .then(res => setCourses(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { title, description, thumbnail_url: thumbnailUrl, is_published: isPublished };
    
    try {
      if (isEditing) {
        await api.put(`/api/admin/courses/${currentId}`, payload);
      } else {
        await api.post('/api/admin/courses', payload);
      }
      resetForm();
      fetchCourses();
    } catch (err) {
      console.error(err);
      alert('Failed to save course');
    }
  };

  const editCourse = (course) => {
    setIsEditing(true);
    setCurrentId(course.id);
    setTitle(course.title);
    setDescription(course.description || '');
    setThumbnailUrl(course.thumbnail_url || '');
    setIsPublished(course.is_published);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteCourse = async (id) => {
    if (!confirm('Are you sure you want to delete this course? This will delete all related videos and enrollments.')) return;
    try {
      await api.delete(`/api/admin/courses/${id}`);
      fetchCourses();
    } catch (err) {
      console.error(err);
      alert('Failed to delete course');
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setTitle('');
    setDescription('');
    setThumbnailUrl('');
    setIsPublished(false);
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto w-full flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <div className="w-full md:w-64 space-y-2">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <h3 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-4">Admin Menu</h3>
          <nav className="space-y-1">
            <Link to="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition">
              <DollarSign className="w-5 h-5" /> Dashboard
            </Link>
            <Link to="/admin/students" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition">
              <Users className="w-5 h-5" /> Manage Students
            </Link>
            <Link to="/admin/courses" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-indigo-600 text-white transition">
              <BookOpen className="w-5 h-5" /> Manage Courses
            </Link>
            <Link to="/admin/videos" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition">
              <PlayCircle className="w-5 h-5" /> Manage Videos
            </Link>
          </nav>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-6 text-white">Manage Courses</h1>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-white">{isEditing ? 'Edit Course' : 'Create New Course'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                <input 
                  type="text" required value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea 
                  rows="3" value={description} onChange={e => setDescription(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Thumbnail URL</label>
                <input 
                  type="url" value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" id="isPublished" checked={isPublished} onChange={e => setIsPublished(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-900 bg-gray-900 border-gray-700"
                />
                <label htmlFor="isPublished" className="text-sm font-medium text-gray-300">Publish Course</label>
              </div>
              <div className="flex gap-4 pt-2">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition">
                  {isEditing ? <Edit2 className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                  {isEditing ? 'Update Course' : 'Create Course'}
                </button>
                {isEditing && (
                  <button type="button" onClick={resetForm} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map(course => (
              <div key={course.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 flex flex-col">
                <div className="h-40 bg-gray-700 relative">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                  )}
                  <div className="absolute top-2 right-2">
                    {course.is_published ? (
                      <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded shadow">Published</span>
                    ) : (
                      <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded shadow">Draft</span>
                    )}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2 flex-1 mb-4">{course.description}</p>
                  
                  <div className="flex gap-2 justify-end border-t border-gray-700 pt-4 mt-auto">
                    <button onClick={() => editCourse(course)} className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded transition">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => deleteCourse(course.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded transition">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {courses.length === 0 && (
              <div className="col-span-full p-8 text-center text-gray-500 bg-gray-800 rounded-xl border border-gray-700 border-dashed">
                No courses created yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
