import { useNavigate } from 'react-router-dom';
import { Stethoscope, User, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Home() {
    return (
        <div className="pt-20 container min-h-screen flex flex-col justify-center">
            <div className="text-center mb-12 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">Welcome to CareConnect</h1>
                <p className="text-xl text-slate-500">Please select your role to proceed to the portal.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <RoleCard
                    role="Doctor"
                    icon={<Stethoscope size={48} />}
                    desc="Login to view appointments & patient records"
                    link="/login/doctor"
                    color="text-blue-600"
                    bg="bg-blue-50"
                />
                <RoleCard
                    role="Patient"
                    icon={<User size={48} />}
                    desc="Book appointments & view medical history"
                    link="/login/patient"
                    color="text-emerald-500"
                    bg="bg-emerald-50"
                />
                <RoleCard
                    role="Admin"
                    icon={<ShieldCheck size={48} />}
                    desc="Manage staff, patients & hospital resources"
                    link="/login/admin"
                    color="text-slate-600"
                    bg="bg-slate-100"
                />
            </div>
        </div>
    );
}

function RoleCard({ role, icon, desc, link, color, bg }) {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(link)}
            className="card cursor-pointer hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center text-center p-8 border border-slate-200"
        >
            <div className={`p-6 rounded-full ${bg} ${color} mb-6`}>
                {icon}
            </div>
            <h2 className="text-2xl font-bold mb-2">{role}</h2>
            <p className="text-slate-500 mb-6">{desc}</p>
            <button className={`btn btn-outline w-full flex items-center justify-center gap-2 group`}>
                {role} Login <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
}
