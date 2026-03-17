import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        if (username === 'admin' && password === 'admin123') {
            login({ name: 'Super Admin', role: 'admin' });
            navigate('/dashboard/admin');
        } else {
            setError('Invalid credentials.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <div className="card w-full max-w-md animate-fade-in relative z-10 border-t-4 border-t-slate-800">
                <Link to="/" className="absolute top-4 left-4 text-slate-400 hover:text-slate-800 transition-colors">
                    <ArrowLeft size={24} />
                </Link>

                <div className="text-center mb-8 mt-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-slate-200 text-slate-700 flex items-center justify-center mb-4">
                        <ShieldCheck size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Admin Panel</h2>
                    <p className="text-slate-500">Restricted access. Authorized personnel only.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                        <input
                            type="text"
                            className="form-input focus:border-slate-800 focus:ring-slate-800"
                            placeholder="admin"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="form-input focus:border-slate-800 focus:ring-slate-800"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center gap-2 border border-red-100">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <button className="btn w-full bg-slate-800 hover:bg-slate-900 text-white">
                        Access Dashboard
                    </button>

                    <div className="text-xs text-center text-red-400 mt-6">
                        Unauthorized access is monitored.
                    </div>

                    <div className="text-xs text-center text-slate-400 mt-2 bg-white p-2 border rounded">
                        Test: <strong>admin</strong> / <strong>admin123</strong>
                    </div>
                </form>
            </div>
        </div>
    );
}
