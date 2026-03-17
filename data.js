/**
 * CareConnect Shared Data Manager & Auth System
 * Simulates a backend database using browser LocalStorage + SessionStorage.
 */

const STORAGE_KEY = 'careconnect_db_v2'; // Changed key to force data reset
const SESSION_KEY = 'careconnect_session';

// --- Database Initialization ---

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
        { id: "apt_1", doctorId: "doc_001", patientName: "John Doe", patientId: "pat_101", time: "2026-02-15 09:00", type: "Regular Checkup", status: "confirmed" },
        { id: "apt_2", doctorId: "doc_001", patientName: "Mary Jane", patientId: "pat_102", time: "2026-02-16 10:30", type: "Consultation", status: "pending" },
        { id: "apt_3", doctorId: "doc_002", patientName: "John Doe", patientId: "pat_101", time: "2026-02-16 14:00", type: "Vaccination", status: "pending" }
    ],
    prescriptions: [
        { id: "rx_1", patientId: "pat_101", doctorName: "Dr. Sarah Smith", medicine: "Aspirin 100mg", date: "2026-01-10" }
    ],
    logs: [
        { msg: "System initialized", time: "2026-01-16 08:00" }
    ]
};
function initDB() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    }
}
function getDB() {
    initDB();
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

function saveDB(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function resetDB() {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    location.reload();
}
// --- Auth System (Session) ---

function loginUser(userObject) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(userObject));
}
function getCurrentUser() {
    const userStr = sessionStorage.getItem(SESSION_KEY);
    return userStr ? JSON.parse(userStr) : null;
}
function logoutUser() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = 'index.html';
}
function requireAuth(role) {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'index.html'; // Redirect to home if not logged in
        return null;
    }
    if (role && user.role !== role) {
        alert("Unauthorized access!");
        window.location.href = 'index.html';
        return null;
    }
    return user;
}
// --- API Methods ---

// 1. Appointments
function getAppointmentsForDoctor(doctorId) {
    const db = getDB();
    return db.appointments.filter(a => a.doctorId === doctorId);
}

function getAppointmentsForPatient(patientId) {
    const db = getDB();
    return db.appointments.filter(a => a.patientId === patientId);
}

function bookAppointment(aptData) {
    const db = getDB();
    const newApt = {
        id: 'apt_' + Date.now(),
        status: 'pending',
        ...aptData
    };
    db.appointments.push(newApt);

    // Log
    db.logs.unshift({ msg: `Appointment booked: ${aptData.patientName} with ${aptData.doctorName || 'Doctor'}`, time: new Date().toLocaleTimeString() });

    saveDB(db);
    return newApt;
}

function updateAppointmentStatus(aptId, newStatus) {
    const db = getDB();
    const apt = db.appointments.find(a => a.id === aptId);
    if (apt) {
        apt.status = newStatus;
        saveDB(db);
        return true;
    }
    return false;
}

// 2. Doctors & Admin
function getAllDoctors() {
    return getDB().users.doctors;
}

function addNewDoctor(doctor) {
    const db = getDB();
    doctor.id = 'doc_' + Date.now();
    // Default email if missing
    if (!doctor.email) doctor.email = doctor.name.toLowerCase().replace(/\s+/g, '.') + '@careconnect.com';

    db.users.doctors.push(doctor);
    db.logs.unshift({ msg: `Admin added doctor: ${doctor.name}`, time: new Date().toLocaleTimeString() });
    saveDB(db);
}

function deleteDoctor(doctorId) {
    const db = getDB();
    db.users.doctors = db.users.doctors.filter(d => d.id !== doctorId);
    db.logs.unshift({ msg: `Admin removed doctor ID: ${doctorId}`, time: new Date().toLocaleTimeString() });
    saveDB(db);
}

// 3. Patients & Prescriptions
function getPrescriptions(patientId) {
    return getDB().prescriptions.filter(p => p.patientId === patientId);
}

// 4. Analytics
function getAnalyticsData() {
    const db = getDB();
    // Count docs per specialization
    const specs = {};
    db.users.doctors.forEach(d => {
        specs[d.specialization] = (specs[d.specialization] || 0) + 1;
    });

    return {
        doctorsCount: db.users.doctors.length,
        patientsCount: db.users.patients.length,
        appointmentsCount: db.appointments.length,
        logs: db.logs,
        specializationCounts: specs
    };
}

initDB();
