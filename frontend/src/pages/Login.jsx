import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Mail, Lock, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface rounded-2xl shadow-xl border border-line p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-secondary">Welcome Back</h2>
        {error && <div className="bg-primary/10 border border-primary text-primary p-3 rounded-lg mb-6 text-sm">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-muted" />
              </div>
              <input 
                type="email" 
                required 
                className="w-full pl-10 pr-4 py-2 bg-canvas border border-line rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-ink transition outline-none"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-muted" />
              </div>
              <input 
                type="password" 
                required 
                className="w-full pl-10 pr-4 py-2 bg-canvas border border-line rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-ink transition outline-none"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2 rounded-lg transition flex items-center justify-center mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>
        <p className="mt-6 text-center text-muted text-sm">
          Don't have an account? <Link to="/register" className="text-primary hover:text-primary-hover transition">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
