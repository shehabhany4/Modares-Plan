# YSA School – Full Stack Student Management

A full stack web application for managing students, built with **Laravel (REST API)** and **React**.

## Tech Stack
- **Backend:** Laravel 12, Laravel Sanctum (token authentication), MySQL
- **Frontend:** React (Vite), Axios
- **API:** RESTful JSON endpoints

## Features
- User registration and login with token-based authentication (Sanctum)
- Protected API routes
- Full CRUD for Students, Teachers and Subjects (REST API)
- Relational database: Teacher → Subjects → Students
- React dashboard to add, edit and delete students

## Live Demo
- Frontend: _add link_
- API: _add link_

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

## Author
Shehab Hany – Faculty of Computers and Artificial Intelligence, Benha University