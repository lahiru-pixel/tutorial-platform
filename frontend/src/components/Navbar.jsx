import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';

export default function Navbar() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const navLinkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-primary text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav aria-label="Main navigation" className="bg-secondary text-white border-b border-white/10 px-4 sm:px-6 py-4 flex flex-wrap gap-4 items-center justify-between sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-white">
        eZy Account with JB
      </Link>
      
      <div className="flex flex-wrap items-center gap-4">
        {user ? (
          <>
            {profile?.role === 'admin' && (
              <NavLink to="/admin" className={navLinkClass}>Admin Panel</NavLink>
            )}
            <div className="text-sm text-white/80 flex flex-wrap items-center break-all">
              {profile?.name || user.email}
              {profile?.role === 'student' && !profile?.is_paid && (
                 <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">Unpaid</span>
              )}
            </div>
            <button onClick={handleLogout} className="px-4 py-2 text-sm bg-primary hover:bg-primary-hover text-white rounded-lg transition font-medium">
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={navLinkClass}>Login</NavLink>
            <NavLink to="/register" className="px-4 py-2 text-sm bg-primary hover:bg-primary-hover text-white rounded-lg transition font-medium aria-[current=page]:ring-2 aria-[current=page]:ring-white aria-[current=page]:ring-offset-2 aria-[current=page]:ring-offset-secondary">
              Sign Up
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
