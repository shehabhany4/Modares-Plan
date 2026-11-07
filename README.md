# 🎓 Modares Plan – School Management System

A Full Stack School Management System designed for teachers and small tutoring centers to manage students, subjects, teachers, and daily attendance through a simple and responsive dashboard.

Built with **Laravel 12 (RESTful API)** and **React (Vite)**.

## 🌐 Live Demo

- **Frontend:** https://modares-plan.vercel.app/
- **Backend API:** https://ysa-school-production.up.railway.app/api

**Demo Teacher Account:**
- Email: `demo@ysa.com`
- Password: `123456`

Newly registered teachers start with an empty workspace. Each teacher can only access and manage their own data.

---

## 💡 Why Modares Plan?

Many small schools and tutoring centers still rely on paper records and scattered spreadsheets to manage their daily operations.

Modares Plan provides a centralized platform where teachers can:

- Manage their students and subjects.
- Organize teachers and class information.
- Track daily student attendance.
- Monitor attendance rates.
- Search, export, and print student records.

The system provides a private workspace for every teacher, ensuring data isolation and secure access.

---

## 🚀 Features

- **Authentication:** Secure registration and login using Laravel Sanctum token-based authentication.
- **Role-Based Access:** Separate permissions for teachers and administrators.
- **Data Isolation:** Each teacher manages and accesses only their own data.
- **Student Management:** Full CRUD operations for student records.
- **Teacher Management:** Manage teacher information.
- **Subject Management:** Create, update, and organize subjects.
- **Attendance Tracking:** Record daily attendance with Present, Late, and Absent statuses.
- **Attendance Reports:** Calculate and display attendance rates per student.
- **Admin Dashboard:** Administrators can view all accounts and delete teacher accounts along with their associated data.
- **Search & Export:** Search student records, export data to CSV, and print student lists.
- **Responsive Design:** Dashboard optimized for different screen sizes.

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript
- Axios
- CSS

### Backend
- PHP
- Laravel 12
- Laravel Sanctum
- RESTful API

### Database
- MySQL

### Deployment & Tools
- Vercel – Frontend Hosting
- Railway – Backend API & MySQL Database
- Docker
- Git & GitHub

---

## 🏗️ Project Structure

```text
Modares-Plan/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   └── package.json
│
├── backend/
│   ├── app/
│   ├── database/
│   ├── routes/
│   ├── config/
│   └── composer.json
│
└── README.md
```

---

## 🔌 API Endpoints

All protected endpoints require a valid authentication token.

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/register` | No | Create a new account |
| POST | `/api/login` | No | Login and receive an access token |
| POST | `/api/logout` | Yes | Logout |
| GET | `/api/me` | Yes | Get the current authenticated user |

### Students

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/students` | Yes | Get all students |
| POST | `/api/students` | Yes | Create a student |
| GET | `/api/students/{id}` | Yes | Get student details |
| PUT | `/api/students/{id}` | Yes | Update student information |
| DELETE | `/api/students/{id}` | Yes | Delete a student |

### Teachers

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/teachers` | Yes | Get all teachers |
| POST | `/api/teachers` | Yes | Create a teacher |
| GET | `/api/teachers/{id}` | Yes | Get teacher details |
| PUT | `/api/teachers/{id}` | Yes | Update teacher information |
| DELETE | `/api/teachers/{id}` | Yes | Delete a teacher |

### Subjects

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/subjects` | Yes | Get all subjects |
| POST | `/api/subjects` | Yes | Create a subject |
| GET | `/api/subjects/{id}` | Yes | Get subject details |
| PUT | `/api/subjects/{id}` | Yes | Update subject information |
| DELETE | `/api/subjects/{id}` | Yes | Delete a subject |

### Attendance

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/attendance?date=YYYY-MM-DD` | Yes | Get students' attendance for a specific date |
| POST | `/api/attendance` | Yes | Save daily attendance |
| GET | `/api/attendance/summary` | Yes | Get attendance rates per student |

### Admin

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/users` | Admin | List all accounts with data counts |
| DELETE | `/api/admin/users/{id}` | Admin | Delete an account and its associated data |

---

## ⚙️ Run Locally

### Prerequisites

Make sure you have installed:

- PHP
- Composer
- MySQL
- Node.js and npm

### 1. Clone the Repository

```bash
git clone https://github.com/shehabhany4/Modares-Plan.git
cd Modares-Plan
```

### 2. Backend Setup

```bash
cd backend

composer install

cp .env.example .env

php artisan key:generate
```

Configure your database credentials in the `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=modares_plan
DB_USERNAME=root
DB_PASSWORD=

ADMIN_EMAILS=you@example.com
```

Run database migrations:

```bash
php artisan migrate
```

Start the Laravel development server:

```bash
php artisan serve
```

Backend API will be available at:

`http://127.0.0.1:8000/api`

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend

npm install

npm run dev
```

Frontend will be available at:

`http://localhost:5173`

### 4. API Configuration

To connect the frontend to a different backend API, configure the following environment variable:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

For production, use your deployed Railway API URL.

---

## 🔐 Security & Data Isolation

- Authentication is handled using Laravel Sanctum.
- Protected API routes require a valid access token.
- Teacher accounts have isolated workspaces.
- Administrators have additional permissions to manage accounts.
- Sensitive configuration values are stored in environment variables.

---

## 👨‍💻 Author

**Shehab Hany**

Computer and Artificial Intelligence – Benha University

- GitHub: https://github.com/shehabhany4
- LinkedIn: https://www.linkedin.com/in/shehab-hany-891a41327/

---

⭐ If you find this project interesting, feel free to explore the repository!