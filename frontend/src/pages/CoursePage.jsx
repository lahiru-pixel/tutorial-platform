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

  if (loading) return <div className="p-8 text-center text-muted">Loading course...</div>;
  if (!course) return <div className="p-8 text-center text-muted">Course not found</div>;

  const canWatch = profile?.is_paid || profile?.role === 'admin';

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <div className="bg-surface rounded-2xl p-8 border border-line mb-8 flex flex-col md:flex-row gap-8 items-start">
        {course.thumbnail_url && (
          <img src={course.thumbnail_url} alt={course.title} className="w-full md:w-64 h-40 object-cover rounded-xl shadow-lg" />
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4 text-secondary">{course.title}</h1>
          <p className="text-muted text-lg leading-relaxed">{course.description}</p>
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        Course Content
        <span className="text-sm font-normal text-muted bg-canvas px-3 py-1 rounded-full border border-line">
          {course.videos?.length || 0} videos
        </span>
      </h2>
      
      <div className="space-y-4">
        {course.videos?.map((video, index) => (
          <div key={video.id} className="bg-surface border border-line rounded-xl p-4 flex items-center justify-between hover:border-line-strong transition">
            <div className="flex items-center gap-4">
              <div className="text-muted font-mono text-lg font-bold w-8 text-center">{index + 1}</div>
              <div>
                <h3 className="font-semibold text-secondary text-lg">{video.title}</h3>
                <div className="flex gap-4 text-sm text-muted mt-1">
                  <span>{video.duration_text || 'Unknown duration'}</span>
                </div>
              </div>
            </div>
            {canWatch ? (
              <Link 
                to={`/videos/${video.id}/watch`} 
                className="bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20 px-4 py-2 rounded-lg transition flex items-center gap-2 font-medium"
              >
                <PlayCircle className="w-5 h-5" />
                Watch
              </Link>
            ) : (
              <div className="text-muted flex items-center gap-2 bg-canvas px-4 py-2 rounded-lg border border-line">
                <Lock className="w-4 h-4" />
                Locked
              </div>
            )}
          </div>
        ))}
        
        {(!course.videos || course.videos.length === 0) && (
           <div className="text-center text-muted py-12 bg-surface rounded-xl border border-line border-dashed">No videos added yet.</div>
        )}
      </div>
    </div>
  );
}
