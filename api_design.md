# CareConnect Hospital Management System - API Documentation

## Overview
This document outlines the REST API design for the CareConnect Hospital Management System. 
The API is designed to be RESTful, using JSON for data exchange.

### Base URL
`http://api.careconnect.com/v1`

### Authentication & Security
- **JWT (JSON Web Token)**: Used for secure authentication.
- **Authorization Header**: `Bearer <token>` must be included in protected routes.
- **Role-Based Access Control (RBAC)**: Middleware checks user role (`doctor`, `patient`, `admin`) before granting access to specific endpoints.
- **Password Usage**: Passwords should never be stored in plain text. Use `bcrypt` or `Argon2` for hashing.

---

## 1. Authentication APIs

### 1.1 Doctor Login
**Endpoint**: `POST /api/auth/doctor/login`  
**Description**: Authenticates a doctor and returns a JWT token.

**Request Body**:
```json
{
  "identifier": "dr.smith@example.com", 
  "password": "securepassword123",
  "specialization": "Cardiologist" // Optional validation context
}
```

**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5...",
    "user": {
      "id": "doc_123456",
      "name": "Dr. Smith",
      "role": "doctor",
      "specialization": "Cardiologist"
    }
  }
}
```

**Response (401 Unauthorized)**:
```json
{
  "status": "error",
  "message": "Invalid credentials provided."
}
```

### 1.2 Patient Login
**Endpoint**: `POST /api/auth/patient/login`  
**Description**: Authenticates a patient.

**Request Body**:
```json
{
  "identifier": "john.doe@example.com",
  "password": "patientpassword123"
}
```

**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5...",
    "user": {
      "id": "pat_987654",
      "name": "John Doe",
      "role": "patient"
    }
  }
}
```

### 1.3 Admin Login
**Endpoint**: `POST /api/auth/admin/login`  
**Description**: Authenticates an administrator.

**Request Body**:
```json
{
  "username": "admin_main",
  "password": "supersecretpassword"
}
```

**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Admin access granted",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5...",
    "user": {
      "id": "adm_000001",
      "role": "admin"
    }
  }
}
```

---

## 2. Appointment APIs

### 2.1 Book Appointment (Patient)
**Endpoint**: `POST /api/appointments/book`  
**Access**: Protected (Patient)

**Request Body**:
```json
{
  "doctor_id": "doc_123456",
  "date": "2026-02-15",
  "time_slot": "10:30 AM",
  "reason": "Chest pain and regular checkup"
}
```

**Response (201 Created)**:
```json
{
  "status": "success",
  "message": "Appointment request sent successfully",
  "data": {
    "appointment_id": "apt_555666",
    "status": "pending"
  }
}
```

### 2.2 View Appointments (Patient)
**Endpoint**: `GET /api/patients/:patient_id/appointments`  
**Access**: Protected (Patient)

**Response (200 OK)**:
```json
{
  "status": "success",
  "data": [
    {
      "appointment_id": "apt_555666",
      "doctor_name": "Dr. Smith",
      "date": "2026-02-15",
      "time": "10:30 AM",
      "status": "pending"
    }
  ]
}
```

### 2.3 Approve/Reject Appointment (Doctor)
**Endpoint**: `PATCH /api/appointments/:appointment_id/status`  
**Access**: Protected (Doctor)

**Request Body**:
```json
{
  "status": "approved", // or "rejected"
  "notes": "Please bring previous reports."
}
```

---

## 3. Admin APIs

### 3.1 Add New Doctor
**Endpoint**: `POST /api/admin/doctors`  
**Access**: Protected (Admin)

**Request Body**:
```json
{
  "name": "Dr. Sarah Conner",
  "email": "sarah.c@careconnect.com",
  "password": "initialPassword123",
  "specialization": "Neurologist",
  "department_id": "dept_003"
}
```

### 3.2 View All Patients
**Endpoint**: `GET /api/admin/patients`  
**Access**: Protected (Admin)  
**Query Params**: `?page=1&limit=20`

### 3.3 Assign Doctor to Department
**Endpoint**: `POST /api/admin/assignments`  
**Access**: Protected (Admin)

**Request Body**:
```json
{
  "doctor_id": "doc_888999",
  "department_id": "dept_004"
}
```

---

## 4. Future Improvements
- **Dashboard Analytics Endpoint**: `GET /api/admin/stats` to fetch bed availability, daily revenue, etc.
- **Notifications**: Implement WebSockets (`socket.io`) for real-time appointment updates.
