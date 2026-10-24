import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Mail, Lock, User, Loader2 } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: { name }
      }
    });
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
        <h2 className="text-3xl font-bold mb-6 text-center text-secondary">Create Account</h2>
        {error && <div className="bg-primary/10 border border-primary text-primary p-3 rounded-lg mb-6 text-sm">{error}</div>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-muted" />
              </div>
              <input 
                type="text" 
                required 
                className="w-full pl-10 pr-4 py-2 bg-canvas border border-line rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-ink transition outline-none"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
          </div>
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
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
          </button>
        </form>
        <p className="mt-6 text-center text-muted text-sm">
          Already have an account? <Link to="/login" className="text-primary hover:text-primary-hover transition">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
