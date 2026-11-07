# YSA School – Full Stack School Management

A full stack web application that helps teachers and small tutoring centers manage students, subjects and daily attendance. Built with **Laravel (REST API)** and **React**.

## Why this project?
Many small schools and tutoring centers still track students and attendance on paper or scattered spreadsheets. This app gives every teacher a private workspace to manage their own students, subjects and attendance, see attendance rates, and export class lists to CSV or print them.

## Live Demo
- Frontend: https://ysa-school-web.vercel.app
- API: https://ysa-school-production.up.railway.app/api
- Demo teacher account (with sample data): `demo@ysa.com` / `123456`

New accounts start with an empty workspace, because each teacher only sees their own data.

## Tech Stack
- **Backend:** Laravel 12, Laravel Sanctum (token authentication), MySQL
- **Frontend:** React (Vite), Axios
- **Deployment:** Railway (API + MySQL, Docker), Vercel (frontend)

## Features
- Register / login with token-based authentication (Sanctum)
- **Per-teacher data isolation:** each teacher sees and manages only their own students, teachers, subjects and attendance
- **Admin role** (configured by email): sees all data and can list and delete teacher accounts with all their data
- Full CRUD for Students, Teachers and Subjects
- Relational database: Teacher → Subjects → Students
- Daily attendance (present / late / absent) with attendance rate per student
- Search, CSV export and print for the student list
- Responsive React dashboard

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/register | No | Create account |
| POST | /api/login | No | Login, returns token |
| POST | /api/logout | Yes | Logout |
| GET | /api/me | Yes | Current user (includes `is_admin`) |
| GET/POST | /api/students | Yes | List / create students |
| GET/PUT/DELETE | /api/students/{id} | Yes | Show / update / delete |
| GET/POST | /api/teachers | Yes | List / create teachers |
| GET/PUT/DELETE | /api/teachers/{id} | Yes | Show / update / delete |
| GET/POST | /api/subjects | Yes | List / create subjects |
| GET/PUT/DELETE | /api/subjects/{id} | Yes | Show / update / delete |
| GET | /api/attendance?date=YYYY-MM-DD | Yes | Students with their status for a day |
| POST | /api/attendance | Yes | Save attendance for a day |
| GET | /api/attendance/summary | Yes | Attendance rate per student |
| GET | /api/admin/users | Admin | List all accounts with counts |
| DELETE | /api/admin/users/{id} | Admin | Delete a teacher account and its data |

## Run Locally

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# set DB_* values in .env (MySQL) and ADMIN_EMAILS=you@example.com
php artisan migrate
php artisan serve
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend: http://localhost:5173 — API: http://127.0.0.1:8000
To use a different API, set `VITE_API_URL` (e.g. `VITE_API_URL=https://your-api/api`).

## Author
Shehab Hany – Faculty of Computers and Artificial Intelligence, Benha University