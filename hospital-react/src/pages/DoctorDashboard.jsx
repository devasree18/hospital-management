import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/db';
import { CheckCircle, Clock, Calendar, User, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function DoctorDashboard() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState('all');

    const refresh = () => {
        const data = db.getAppointmentsForDoctor(user.id);
        setAppointments(data);
    };

    useEffect(() => {
        refresh();
    }, []);

    const handleApprove = (id) => {
        db.updateAppointmentStatus(id, 'confirmed');
        toast.success("Appointment Approved!");
        refresh();
    };

    const stats = {
        total: appointments.length,
        pending: appointments.filter(a => a.status === 'pending').length,
        today: appointments.filter(a => new Date(a.time).toDateString() === new Date().toDateString()).length
    };

    const filteredApps = appointments.filter(a => {
        if (filter === 'pending') return a.status === 'pending';
        if (filter === 'confirmed') return a.status === 'confirmed';
        return true;
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-24 container max-w-6xl"
        >
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Doctor Dashboard</h1>
                    <p className="text-slate-500 mt-1">Overview for Dr. {user.name.split(' ')[1]}</p>
                </div>
                <div className="text-right hidden md:block">
                    <div className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                        {user.specialization}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    label="Total Appointments"
                    val={stats.total}
                    icon={<Calendar size={24} />}
                    color="text-blue-600" bg="bg-blue-50"
                />
                <StatCard
                    label="Pending Reviews"
                    val={stats.pending}
                    icon={<Clock size={24} />}
                    color="text-orange-600" bg="bg-orange-50"
                />
                <StatCard
                    label="Today's Visits"
                    val={stats.today}
                    icon={<User size={24} />}
                    color="text-emerald-600" bg="bg-emerald-50"
                />
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h3 className="text-xl font-bold text-slate-800">Patient Queue</h3>

                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <FilterBtn active={filter === 'all'} onClick={() => setFilter('all')}>All</FilterBtn>
                        <FilterBtn active={filter === 'pending'} onClick={() => setFilter('pending')}>Pending</FilterBtn>
                        <FilterBtn active={filter === 'confirmed'} onClick={() => setFilter('confirmed')}>Confirmed</FilterBtn>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="py-4 px-6 text-slate-500 font-medium text-sm">Patient Name</th>
                                <th className="py-4 px-6 text-slate-500 font-medium text-sm">Schedule</th>
                                <th className="py-4 px-6 text-slate-500 font-medium text-sm">Purpose</th>
                                <th className="py-4 px-6 text-slate-500 font-medium text-sm">Status</th>
                                <th className="py-4 px-6 text-slate-500 font-medium text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApps.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <Search size={32} className="opacity-20" />
                                            No appointments found.
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredApps.map((apt, i) => (
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={apt.id}
                                    className="border-b border-gray-50 last:border-0 hover:bg-slate-50/80 transition-colors"
                                >
                                    <td className="py-4 px-6 font-semibold text-slate-700">{apt.patientName}</td>
                                    <td className="py-4 px-6 text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-slate-400" />
                                            {new Date(apt.time).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-slate-600">{apt.type}</td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${apt.status === 'confirmed' ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
                                            {apt.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        {apt.status === 'pending' ? (
                                            <button
                                                onClick={() => handleApprove(apt.id)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 px-3 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1"
                                            >
                                                <CheckCircle size={14} /> Approve
                                            </button>
                                        ) : (
                                            <span className="text-slate-400 text-xs italic">No actions needed</span>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}

function StatCard({ label, val, icon, color, bg }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
                <p className="text-3xl font-bold text-slate-800">{val}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl ${bg} ${color} flex items-center justify-center`}>
                {icon}
            </div>
        </div>
    );
}

function FilterBtn({ active, onClick, children }) {
    return (
        <button
            onClick={onClick}
            className={`text-sm font-medium px-4 py-1.5 rounded-md transition-colors ${active ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
            {children}
        </button>
    );
}
