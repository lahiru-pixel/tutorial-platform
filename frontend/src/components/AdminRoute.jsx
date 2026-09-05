import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>;
  if (!user || profile?.role !== 'admin') return <Navigate to="/" replace />;

  return children;
}
