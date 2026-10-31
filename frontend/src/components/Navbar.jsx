import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';

export default function Navbar() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const navLinkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-white/10 text-white' : 'text-white/75 hover:bg-white/10 hover:text-white'}`;

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, hash]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="bg-secondary text-white border-b border-white/10 sticky top-0 z-50">
      <nav aria-label="Main navigation" className="w-[calc(100%-40px)] md:w-[calc(100%-64px)] max-w-[1200px] mx-auto min-h-20 flex flex-wrap items-center justify-between gap-x-4 py-3" onKeyDown={event => {
        if (event.key === 'Escape' && menuOpen) {
          setMenuOpen(false);
          menuButtonRef.current?.focus();
        }
      }}>
        <Link to="/" className="flex items-center gap-3 shrink-0" aria-label="eZy Account with JB home" onClick={() => setMenuOpen(false)}>
          <span className="bg-white rounded-lg w-11 h-12 p-1.5 flex items-center justify-center"><img src="/logo.svg" alt="" width="32" height="37" /></span>
          <span className="text-lg font-bold leading-tight text-white">eZy Account<span className="block text-[10px] font-medium tracking-[0.2em] text-white/60 mt-1">WITH JB</span></span>
        </Link>
        <button ref={menuButtonRef} type="button" className="lg:hidden p-2.5 rounded-lg border border-white/20 hover:bg-white/10" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="main-navigation-links" onClick={() => setMenuOpen(open => !open)}>
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
        <div id="main-navigation-links" className={`${menuOpen ? 'flex' : 'hidden'} lg:flex w-full lg:w-auto flex-col lg:flex-row lg:items-center gap-2 lg:gap-1 pt-4 pb-1 lg:py-0`}>
        <NavLink to="/" end className={navLinkClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
        <Link to="/#courses" className="rounded-lg px-3 py-2.5 text-sm text-white/75 hover:bg-white/10 hover:text-white" onClick={() => setMenuOpen(false)}>Courses</Link>
        <Link to="/#about" className="rounded-lg px-3 py-2.5 text-sm text-white/75 hover:bg-white/10 hover:text-white" onClick={() => setMenuOpen(false)}>About Jayaruwan</Link>
        {user ? (
          <>
            <NavLink to="/my-courses" className={navLinkClass}>My Courses</NavLink>
            {profile?.role === 'admin' && (
              <NavLink to="/admin" className={navLinkClass}>Admin Panel</NavLink>
            )}
            <div className="text-xs text-white/65 flex items-center gap-2 px-3 py-2 lg:max-w-36">
              <span className="truncate" title={profile?.name || user.email}>{profile?.name || user.email}</span>
              {profile?.role === 'student' && !profile?.is_paid && (
                 <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded-full shrink-0">Unpaid</span>
              )}
            </div>
            <button onClick={handleLogout} className="px-4 py-2.5 text-sm border border-white/25 hover:bg-white/10 text-white rounded-lg transition font-medium">
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={navLinkClass}>Sign in</NavLink>
            <NavLink to="/register" className="lg:ml-3 px-4 py-3 text-sm bg-primary hover:bg-primary-hover text-white rounded-lg transition font-semibold flex items-center justify-center gap-3 aria-[current=page]:ring-2 aria-[current=page]:ring-white aria-[current=page]:ring-offset-2 aria-[current=page]:ring-offset-secondary">
              Get started <ArrowUpRight size={16} aria-hidden="true" />
            </NavLink>
          </>
        )}
        </div>
      </nav>
    </header>
  );
}
