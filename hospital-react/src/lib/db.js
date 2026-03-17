const STORAGE_KEY = 'careconnect_db_react_v1';

const initialData = {
    users: {
        doctors: [
            { id: "doc_001", name: "Dr. Sarah Smith", email: "dr.sarah@hospital.com", password: "doc123", specialization: "Cardiology" },
            { id: "doc_002", name: "Dr. James Wilson", email: "james@example.com", password: "password", specialization: "Pediatrics" },
            { id: "doc_003", name: "Dr. Emily Chen", email: "emily@example.com", password: "password", specialization: "Neurology" }
        ],
        patients: [
            { id: "pat_101", name: "John Doe", email: "john@example.com", password: "123", phone: "555-0101" },
            { id: "pat_102", name: "Mary Jane", email: "mary@example.com", password: "123", phone: "555-0102" }
        ]
    },
    appointments: [
        { id: "apt_1", doctorId: "doc_001", patientName: "John Doe", patientId: "pat_101", time: "2026-02-15T09:00", type: "Regular Checkup", status: "confirmed" },
        { id: "apt_2", doctorId: "doc_001", patientName: "Mary Jane", patientId: "pat_102", time: "2026-02-16T10:30", type: "Consultation", status: "pending" },
    ],
    logs: [
        { msg: "System initialized", time: "2026-01-16 08:00" }
    ]
};

export const db = {
    init: () => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        }
    },
    get: () => {
        db.init();
        return JSON.parse(localStorage.getItem(STORAGE_KEY));
    },
    save: (data) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },

    // Auth Helpers
    loginDoctor: (email, password) => {
        const d = db.get();
        return d.users.doctors.find(u => u.email === email && u.password === password);
    },
    loginPatient: (email, password) => {
        const d = db.get();
        return d.users.patients.find(u => u.email === email && u.password === password);
    },

    // Data Helpers
    getAppointmentsForDoctor: (docId) => {
        const d = db.get();
        return d.appointments.filter(a => a.doctorId === docId);
    },
    getAppointmentsForPatient: (patId) => {
        const d = db.get();
        // Return latest first
        return d.appointments.filter(a => a.patientId === patId).reverse();
    },
    updateAppointmentStatus: (id, status) => {
        const d = db.get();
        const apt = d.appointments.find(a => a.id === id);
        if (apt) {
            apt.status = status;
            db.save(d);
            return true;
        }
        return false;
    },
    bookAppointment: (apt) => {
        const d = db.get();
        const newApt = { ...apt, id: 'apt_' + Date.now(), status: 'pending' };
        d.appointments.push(newApt);
        d.logs.unshift({ msg: `New appointment: ${apt.type}`, time: new Date().toLocaleTimeString() });
        db.save(d);
        return newApt;
    },
    getStats: () => {
        const d = db.get();
        return {
            doctors: d.users.doctors.length,
            patients: d.users.patients.length,
            appointments: d.appointments.length
        };
    },
    getAllDoctors: () => {
        return db.get().users.doctors;
    }
};
