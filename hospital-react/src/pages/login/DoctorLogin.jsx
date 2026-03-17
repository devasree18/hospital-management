import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/db';
import { Stethoscope, AlertCircle, ArrowLeft } from 'lucide-react';

export default function DoctorLogin() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [specialization, setSpecialization] = useState('Cardiology');

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        const user = db.loginDoctor(email, password);
        if (user) {
            login({ ...user, role: 'doctor' });
            navigate('/dashboard/doctor');
        } else {
            setError('Invalid doctor credentials. Please check your email and password.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50/50 p-4">
            <div className="card w-full max-w-md animate-fade-in relative z-10">
                <Link to="/" className="absolute top-4 left-4 text-slate-400 hover:text-blue-600 transition-colors">
                    <ArrowLeft size={24} />
                </Link>

                <div className="text-center mb-8 mt-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                        <Stethoscope size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Doctor Portal</h2>
                    <p className="text-slate-500">Secure access for medical staff</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email or ID</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="dr.name@hospital.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
                        <select
                            className="form-select"
                            value={specialization}
                            onChange={(e) => setSpecialization(e.target.value)}
                        >
                            <option value="Cardiology">Cardiology</option>
                            <option value="Neurology">Neurology</option>
                            <option value="Pediatrics">Pediatrics</option>
                            <option value="General">General Physician</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="form-input"
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
                            <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                            Remember me
                        </label>
                        <a href="#" className="text-blue-600 hover:underline">Forgot Password?</a>
                    </div>

                    <button className="btn w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200">
                        Secure Login
                    </button>

                    <div className="text-xs text-center text-slate-400 mt-6 bg-slate-50 p-3 rounded border border-slate-100">
                        Test: <strong>dr.sarah@hospital.com</strong> / <strong>doc123</strong>
                    </div>
                </form>
            </div>
        </div>
    );
}
