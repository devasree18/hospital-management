# CareConnect Hospital Management System

A modern, responsive, and **fully dynamic** Hospital Management System interface. 
It features role-based access, interactive dashboards, and a simulated local database for persistent testing.

## 🚀 Live Features

### 1. 🔐 Dynamic Authentication
The system uses `data.js` to simulate a real backend. You must use valid credentials to log in.

| Role | Username / Email | Password |
|------|------------------|----------|
| **Doctor** | `sarah@example.com` | (Any) |
| **Patient** | `john@example.com` | (Any) |
| **Admin** | `admin` | `admin123` |

### 2. 🏥 Interactive Dashboards
- **Patient**: Can **Book Appointments** via a modal. These instantly appear in the doctor's dashboard.
- **Doctor**: Can **Approve** pending appointments. Updates are saved instantly.
- **Admin**: Views real-time **Analytics** (Charts) and system logs.

### 3. 💾 Data Persistence
All data (appointments, new doctors, logs) is saved to your browser's **LocalStorage**. 
This means if you refresh the page, your data remains!

## 📁 Project Structure

```
/hospital-management
│
├── index.html            # Landing Page
├── data.js               # The "Backend" Logic & Database
├── style.css             # Shared Styles
│
├── doctor_login.html     # Auth Pages (with validation)
├── doctor_dashboard.html # Dynamic Dashboard
│
├── patient_login.html
├── patient_dashboard.html
│
├── admin_login.html
├── admin_dashboard.html
```

## 🛠️ Developer Notes
- **Resetting Data**: If you want to clear all data and start fresh, open the browser console (F12) and run `resetDB()`.
- **API Simulation**: `data.js` contains methods like `bookAppointment()` and `getSystemStats()` which mimic REST API calls.
