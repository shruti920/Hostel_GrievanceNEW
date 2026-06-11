# Hostel Grievance Portal

A role-based grievance management system built for IIT Bhubaneswar hostels. The platform allows students to submit and track hostel-related grievances while enabling Hall Office staff to manage, review, and resolve complaints efficiently.

---

## Features

### Student Portal

* Google Sign-In using IIT Bhubaneswar email accounts
* Hostel registration and profile management
* Submit grievances by category
* Upload image evidence
* Track complaint status
* View complaint details and evidence
* Dashboard with complaint statistics

### Hall Office Portal

* View hostel-specific complaints
* Search and filter complaints
* Update complaint status
* View uploaded evidence
* Complaint management dashboard

### Authentication & Access Control

* Google OAuth authentication using NextAuth
* IIT Bhubaneswar email restriction (`@iitbbs.ac.in`)
* Role-based access control
* Protected routes for students and Hall Office staff

---

## Tech Stack

### Frontend

* Next.js 16 (App Router)
* React
* Tailwind CSS

### Backend

* Next.js API Routes
* NextAuth.js

### Database & Storage

* Supabase PostgreSQL
* Supabase Storage

### Authentication

* Google OAuth

---

## Project Structure

```text
src/
├── app/
│   ├── api/
│   ├── student/
│   ├── hall-office/
│   ├── submit-complaint/
│   ├── track-complaints/
│   └── complaints/[id]/
│
├── components/
├── lib/
├── constants/
└── middleware.js
```

---

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=
```

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd hostel-grievance-portal
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Production Build

Build the application:

```bash
npm run build
```

Run the production server:

```bash
npm run start
```

---

## User Roles

### Student

* Register hostel details
* Submit grievances
* Upload evidence images
* Track grievance progress

### Hall Office

* View assigned hostel complaints
* Review complaint details
* Update complaint status
* View uploaded evidence

---

## Database Tables

### users

Stores user profile information.

### hostels

Stores hostel details and codes.

### complaints

Stores grievance information including:

* Complaint code
* Category
* Title
* Description
* Status
* Hostel details
* Evidence image URL

---

## Storage

Supabase Storage bucket:

```text
complaint-images
```

Used for storing complaint evidence uploaded by students.

---

## Current Version

### Version 1.0

Implemented:

* Authentication
* Role-based access
* Hostel registration
* Complaint submission
* Complaint tracking
* Complaint status management
* Evidence image uploads
* Hall Office dashboard

---

## License

This project was developed as part of an academic software project for IIT Bhubaneswar.

