import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/db';
import { User, AlertCircle, ArrowLeft } from 'lucide-react';

export default function PatientLogin() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        const user = db.loginPatient(email, password);
        if (user) {
            login({ ...user, role: 'patient' });
            navigate('/dashboard/patient');
        } else {
            setError('Account not found. Please register first.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-emerald-50/50 p-4">
            <div className="card w-full max-w-md animate-fade-in relative z-10 border-t-4 border-t-emerald-500">
                <Link to="/" className="absolute top-4 left-4 text-slate-400 hover:text-emerald-600 transition-colors">
                    <ArrowLeft size={24} />
                </Link>

                <div className="text-center mb-8 mt-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                        <User size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Patient Login</h2>
                    <p className="text-slate-500">Welcome back! Please login to your account.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email or Patient ID</label>
                        <input
                            type="text"
                            className="form-input focus:border-emerald-500 focus:ring-emerald-500"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="form-input focus:border-emerald-500 focus:ring-emerald-500"
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

                    <div className="flex justify-between items-center text-sm">
                        <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                            <input type="checkbox" className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                            Remember me
                        </label>
                        <a href="#" className="text-emerald-600 hover:underline">Forgot Password?</a>
                    </div>

                    <button className="btn w-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-200">
                        Login
                    </button>

                    <div className="text-center mt-4">
                        <p className="text-sm text-slate-600">
                            New to CareConnect? <a href="#" className="text-emerald-600 font-semibold hover:underline">Register New Patient</a>
                        </p>
                    </div>

                    <div className="text-xs text-center text-slate-400 mt-6 bg-slate-50 p-3 rounded border border-slate-100">
                        Test: <strong>john@example.com</strong> / <strong>123</strong>
                    </div>
                </form>
            </div>
        </div>
    );
}
