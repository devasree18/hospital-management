import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/db';
import { Stethoscope, User, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Login() {
    const { role } = useParams(); // 'doctor', 'patient', 'admin'
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        if (role === 'admin') {
            if (email === 'admin' && password === 'admin123') {
                login({ name: 'Super Admin', role: 'admin' });
                navigate('/dashboard/admin');
            } else {
                setError('Invalid Admin Credentials');
            }
            return;
        }

        // DB Check
        let user;
        if (role === 'doctor') {
            user = db.loginDoctor(email, password);
        } else {
            user = db.loginPatient(email, password);
        }

        if (user) {
            login({ ...user, role });
            navigate(`/dashboard/${role}`);
        } else {
            setError(`Invalid ${role} credentials.`);
        }
    };

    const config = {
        doctor: { icon: <Stethoscope size={40} />, color: 'text-blue-600', bg: 'bg-blue-50', title: 'Doctor Portal', hint: 'dr.sarah@hospital.com / doc123' },
        patient: { icon: <User size={40} />, color: 'text-emerald-600', bg: 'bg-emerald-50', title: 'Patient Login', hint: 'john@example.com / 123' },
        admin: { icon: <ShieldCheck size={40} />, color: 'text-slate-700', bg: 'bg-slate-100', title: 'Admin Access', hint: 'admin / admin123' }
    }[role];

    return (
        <div className="min-h-screen flex items-center justify-center pt-16 bg-slate-50 p-4">
            <div className="card w-full max-w-md animate-fade-in">
                <div className="text-center mb-6">
                    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${config.bg} ${config.color}`}>
                        {config.icon}
                    </div>
                    <h2 className="text-2xl font-bold">{config.title}</h2>
                    <p className="text-slate-400">Please sign in to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            {role === 'admin' ? 'Username' : 'Email ID'}
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center gap-2">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <button className={`btn w-full mt-4 bg-slate-900 text-white hover:bg-slate-800`}>
                        Secure Login
                    </button>

                    <div className="text-xs text-center text-slate-400 mt-6 bg-slate-100 p-2 rounded">
                        Test: {config.hint}
                    </div>
                </form>
            </div>
        </div>
    );
}
