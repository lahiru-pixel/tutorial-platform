import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, AlertCircle, Maximize } from 'lucide-react';

export default function WatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    api.get(`/api/videos/${id}/watch`)
      .then(res => setVideo(res.data))
      .catch(err => {
        console.error(err);
        setError(err.response?.data?.error || 'Failed to load video');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center text-muted">Loading video securely...</div>;

  if (error) return (
    <div className="p-8 max-w-3xl mx-auto w-full">
      <div className="bg-primary/10 border border-primary text-primary p-6 rounded-xl flex items-center gap-4">
        <AlertCircle className="w-8 h-8" />
        <div>
          <h3 className="font-bold text-lg mb-1">Access Denied</h3>
          <p>{error}</p>
        </div>
      </div>
      <button onClick={() => navigate(-1)} className="mt-6 flex items-center gap-2 text-primary hover:text-primary-hover transition">
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
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-primary hover:text-primary-hover w-fit transition">
        <ArrowLeft className="w-4 h-4" /> Back to Course
      </button>
      
      <div ref={containerRef} className="relative bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video w-full border border-line">
        {videoId ? (
          <>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&fs=0`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
            {/* Invisible shields to block clicks on YouTube branding */}
            <div className="absolute top-0 left-0 w-full h-12 md:h-24 bg-transparent z-10" title="Protected Video"></div>
            <div className="absolute bottom-0 right-0 w-32 md:w-64 h-12 md:h-24 bg-transparent z-10" title="Protected Video"></div>
            
            {/* Custom Fullscreen Button */}
            <button 
              onClick={toggleFullScreen}
              aria-label="Toggle fullscreen"
              className="absolute bottom-2 right-2 md:bottom-4 md:right-4 z-20 bg-primary hover:bg-primary-hover text-white p-2 rounded-lg transition flex items-center gap-2 text-sm font-medium"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/70">
            Invalid YouTube URL
          </div>
        )}
      </div>
      
      <div className="mt-6 bg-surface rounded-xl p-6 border border-line shadow-sm">
        <h1 className="text-2xl font-bold text-secondary mb-2">{video.title}</h1>
        {video.description && (
          <p className="text-muted">{video.description}</p>
        )}
      </div>
    </div>
  );
}
