import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/db';
import { CalendarPlus, ClipboardList, Clock, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function PatientDashboard() {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [docId, setDocId] = useState('');
    const [date, setDate] = useState('');
    const [reason, setReason] = useState('');

    const refresh = () => {
        setHistory(db.getAppointmentsForPatient(user.id));
        setDoctors(db.getAllDoctors());
        if (db.getAllDoctors().length > 0) setDocId(db.getAllDoctors()[0].id);
    };

    useEffect(() => {
        refresh();
    }, []);

    const handleBook = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate network delay
        await new Promise(r => setTimeout(r, 800));

        const doc = doctors.find(d => d.id === docId);

        db.bookAppointment({
            doctorId: docId,
            patientId: user.id,
            patientName: user.name,
            time: date,
            type: reason,
            doctorName: doc?.name
        });

        setLoading(false);
        setShowModal(false);
        refresh();
        toast.success("Appointment request sent successfully!");
        setReason('');
        setDate('');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="pt-24 container max-w-5xl"
        >
            <header className="mb-8 bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
                    <p className="opacity-90 mt-2 flex items-center gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                            Patient ID: #{user.id.split('_')[1]}
                        </span>
                    </p>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform origin-bottom-left"></div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <QuickActionCard
                    icon={<CalendarPlus size={28} />}
                    title="Book Appointment"
                    desc="Schedule a new visit"
                    onClick={() => setShowModal(true)}
                    color="text-emerald-600"
                    bg="bg-emerald-50"
                />
                <QuickActionCard
                    icon={<ClipboardList size={28} />}
                    title="Medical Records"
                    desc="View prescriptions"
                    onClick={() => toast('No new prescriptions', { icon: '📂' })}
                    color="text-blue-600"
                    bg="bg-blue-50"
                />
                <QuickActionCard
                    icon={<Activity size={28} />}
                    title="Health Vitals"
                    desc="Check latest stats"
                    onClick={() => toast('Vitals module coming soon!', { icon: '💓' })}
                    color="text-rose-600"
                    bg="bg-rose-50"
                />
            </div>

            <div className="card border-0 shadow-lg">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-800">Recent Activity</h3>
                    <Clock size={20} className="text-slate-400" />
                </div>
                <div className="p-6 space-y-6">
                    {history.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            No appointments history found.
                        </div>
                    ) : history.map((apt, i) => (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={apt.id}
                            className="flex gap-4 group"
                        >
                            <div className="relative">
                                <div className={`w-3 h-3 rounded-full mt-2 ring-4 ring-white ${apt.status === 'confirmed' ? 'bg-emerald-500' : 'bg-orange-400'}`}></div>
                                <div className="absolute top-5 left-1.5 w-0.5 h-full bg-slate-100 -z-10 group-last:hidden"></div>
                            </div>
                            <div className="flex-1 bg-slate-50 p-4 rounded-xl hover:bg-slate-100 transition-colors">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-slate-800">{apt.type}</h4>
                                    <span className={`badge text-xs px-2 py-1 rounded-md ${apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {apt.status}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 mt-1">with <span className="font-medium text-slate-700">{db.getAllDoctors().find(d => d.id === apt.doctorId)?.name || 'Doctor'}</span></p>
                                <div className="mt-3 text-xs font-mono text-slate-400 flex items-center gap-1">
                                    <Clock size={12} /> {new Date(apt.time).toLocaleString()}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Premium Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl"
                    >
                        <h2 className="text-2xl font-bold mb-6 text-slate-800">Book Appointment</h2>
                        <form onSubmit={handleBook} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-slate-600">Select Doctor</label>
                                <select className="form-select bg-slate-50" value={docId} onChange={e => setDocId(e.target.value)}>
                                    {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-slate-600">Preferred Date & Time</label>
                                <input type="datetime-local" className="form-input bg-slate-50" required value={date} onChange={e => setDate(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-slate-600">Reason for Visit</label>
                                <textarea className="form-input bg-slate-50" rows="3" required value={reason} onChange={e => setReason(e.target.value)} placeholder="Briefly describe your symptoms..."></textarea>
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium disabled:opacity-50">
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium shadow-lg shadow-emerald-200 disabled:opacity-70 flex items-center gap-2 transition-all">
                                    {loading ? 'Booking...' : 'Confirm Booking'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}

function QuickActionCard({ icon, title, desc, onClick, color, bg }) {
    return (
        <div onClick={onClick} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group">
            <div className={`${bg} ${color} w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <h3 className="font-bold text-lg text-slate-800">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed mt-1">{desc}</p>
        </div>
    );
}
