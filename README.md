# YSA School – Full Stack School Management

A full stack web application that helps small schools and tutoring centers manage students, teachers, subjects and daily attendance in one place. Built with **Laravel (REST API)** and **React**.

## Why this project?
Many small schools and tutoring centers still track students and attendance on paper or scattered spreadsheets. This app gives teachers a single dashboard to manage students, teachers and subjects, record daily attendance, see attendance rates per student, and export class lists to CSV or print them.

## Live Demo
- Frontend: https://ysa-school-web.vercel.app
- API: https://ysa-school-production.up.railway.app/api
- Demo account: `demo@ysa.com` / `123456`

## Tech Stack
- **Backend:** Laravel 12, Laravel Sanctum (token authentication), MySQL
- **Frontend:** React (Vite), Axios
- **API:** RESTful JSON endpoints
- **Deployment:** Railway (API + MySQL, Docker), Vercel (frontend)

## Features
- Register / login with token-based authentication (Sanctum)
- Protected API routes
- Full CRUD for Students, Teachers and Subjects
- Relational database: Teacher → Subjects → Students
- Daily attendance (present / late / absent) with attendance rate per student
- Search students, export the list to CSV, and print it
- Responsive React dashboard with Students, Teachers, Subjects and Attendance pages

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/register | No | Create account |
| POST | /api/login | No | Login, returns token |
| POST | /api/logout | Yes | Logout |
| GET | /api/me | Yes | Current user |
| GET/POST | /api/students | Yes | List / create students |
| GET/PUT/DELETE | /api/students/{id} | Yes | Show / update / delete |
| GET/POST | /api/teachers | Yes | List / create teachers |
| GET/PUT/DELETE | /api/teachers/{id} | Yes | Show / update / delete |
| GET/POST | /api/subjects | Yes | List / create subjects |
| GET/PUT/DELETE | /api/subjects/{id} | Yes | Show / update / delete |
| GET | /api/attendance?date=YYYY-MM-DD | Yes | Students with their status for a day |
| POST | /api/attendance | Yes | Save attendance for a day |
| GET | /api/attendance/summary | Yes | Attendance rate per student |

## Run Locally

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# set DB_DATABASE, DB_USERNAME, DB_PASSWORD in .env (MySQL)
php artisan migrate
php artisan serve
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend runs on http://localhost:5173 and the API on http://127.0.0.1:8000.
To use a different API, set `VITE_API_URL` (e.g. `VITE_API_URL=https://your-api/api`).

## Author
Shehab Hany – Faculty of Computers and Artificial Intelligence, Benha University