import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { PlayCircle, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CoursePage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    api.get(`/api/courses/${id}`)
      .then(res => setCourse(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center text-gray-400">Loading course...</div>;
  if (!course) return <div className="p-8 text-center text-gray-400">Course not found</div>;

  const canWatch = profile?.is_paid || profile?.role === 'admin';

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 mb-8 flex flex-col md:flex-row gap-8 items-start">
        {course.thumbnail_url && (
          <img src={course.thumbnail_url} alt={course.title} className="w-full md:w-64 h-40 object-cover rounded-xl shadow-lg" />
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4 text-white">{course.title}</h1>
          <p className="text-gray-400 text-lg leading-relaxed">{course.description}</p>
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        Course Content
        <span className="text-sm font-normal text-gray-500 bg-gray-900 px-3 py-1 rounded-full border border-gray-700">
          {course.videos?.length || 0} videos
        </span>
      </h2>
      
      <div className="space-y-4">
        {course.videos?.map((video, index) => (
          <div key={video.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center justify-between hover:border-gray-600 transition">
            <div className="flex items-center gap-4">
              <div className="text-gray-500 font-mono text-lg font-bold w-8 text-center">{index + 1}</div>
              <div>
                <h3 className="font-semibold text-white text-lg">{video.title}</h3>
                <div className="flex gap-4 text-sm text-gray-400 mt-1">
                  <span>{video.duration_text || 'Unknown duration'}</span>
                </div>
              </div>
            </div>
            {canWatch ? (
              <Link 
                to={`/videos/${video.id}/watch`} 
                className="bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-600/20 px-4 py-2 rounded-lg transition flex items-center gap-2 font-medium"
              >
                <PlayCircle className="w-5 h-5" />
                Watch
              </Link>
            ) : (
              <div className="text-gray-500 flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg border border-gray-700">
                <Lock className="w-4 h-4" />
                Locked
              </div>
            )}
          </div>
        ))}
        
        {(!course.videos || course.videos.length === 0) && (
           <div className="text-center text-gray-500 py-12 bg-gray-800 rounded-xl border border-gray-700 border-dashed">No videos added yet.</div>
        )}
      </div>
    </div>
  );
}
