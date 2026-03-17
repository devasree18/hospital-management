import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100 py-4 px-6 fixed w-full top-0 z-50 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600 no-underline">
                <HeartPulse size={28} />
                <span className="text-slate-800">Care<span className="text-blue-600">Connect</span></span>
            </Link>

            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <span className="text-sm font-medium text-slate-600 hidden md:block">
                            Welcome, {user.name} ({user.role})
                        </span>
                        <button onClick={handleLogout} className="btn btn-outline text-sm py-2 px-3 flex gap-2 items-center">
                            <LogOut size={16} /> Logout
                        </button>
                    </>
                ) : (
                    <Link to="/" className="text-sm text-slate-500 hover:text-blue-600 font-medium">
                        Emergency: 911
                    </Link>
                )}
            </div>
        </nav>
    );
}
