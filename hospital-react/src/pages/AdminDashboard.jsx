import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/db';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0 });

    useEffect(() => {
        setStats(db.getStats());
    }, []);

    return (
        <div className="pt-24 container">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
                    <p className="text-slate-500">System Overview</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard label="Total Doctors" val={stats.doctors} color="border-l-4 border-blue-500" />
                <StatCard label="Total Patients" val={stats.patients} color="border-l-4 border-emerald-500" />
                <StatCard label="Appointments" val={stats.appointments} color="border-l-4 border-orange-500" />
            </div>

            <div className="card">
                <h3 className="text-xl font-bold mb-4">System Stats (Demo)</h3>
                <p className="text-slate-500">The React migration is complete. More complex analytics can be added here.</p>
            </div>
        </div>
    );
}

function StatCard({ label, val, color }) {
    return (
        <div className={`card p-6 ${color}`}>
            <h4 className="text-slate-500 font-medium mb-2">{label}</h4>
            <div className="text-4xl font-bold text-slate-800">{val}</div>
        </div>
    );
}
