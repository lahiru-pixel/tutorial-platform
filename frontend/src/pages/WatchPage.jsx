import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function WatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/videos/${id}/watch`)
      .then(res => setVideo(res.data))
      .catch(err => {
        console.error(err);
        setError(err.response?.data?.error || 'Failed to load video');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center text-gray-400">Loading video securely...</div>;

  if (error) return (
    <div className="p-8 max-w-3xl mx-auto w-full">
      <div className="bg-red-500/10 border border-red-500 text-red-500 p-6 rounded-xl flex items-center gap-4">
        <AlertCircle className="w-8 h-8" />
        <div>
          <h3 className="font-bold text-lg mb-1">Access Denied</h3>
          <p>{error}</p>
        </div>
      </div>
      <button onClick={() => navigate(-1)} className="mt-6 flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition">
        <ArrowLeft className="w-4 h-4" /> Go Back
      </button>
    </div>
  );

  // Extract YouTube ID from various URL formats
  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = video?.youtube_url ? getYoutubeId(video.youtube_url) : null;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full flex-1 flex flex-col">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white w-fit transition">
        <ArrowLeft className="w-4 h-4" /> Back to Course
      </button>
      
      <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video w-full border border-gray-800">
        {videoId ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Invalid YouTube URL
          </div>
        )}
      </div>
      
      <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-sm">
        <h1 className="text-2xl font-bold text-white mb-2">{video.title}</h1>
        {video.description && (
          <p className="text-gray-400">{video.description}</p>
        )}
      </div>
    </div>
  );
}
