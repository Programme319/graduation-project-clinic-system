# 🏥 Clinic Management System

[![Laravel](https://img.shields.io/badge/Laravel-12.x-red.svg)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://react.dev)
[![PHP](https://img.shields.io/badge/PHP-8.2+-purple.svg)](https://php.net)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A comprehensive medical clinic management system with patient records, medical investigations, medications tracking, and an AI-powered medical assistant chatbot.

---

## 📋 Table of Contents

- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [User Roles](#-user-roles)
- [AI Chatbot](#-ai-chatbot)
- [Security](#-security)
- [Development](#-development)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Patient Management
- ➕ **Create Patient Records** — Register patients with comprehensive medical information
- 📋 **Patient List** — View all patients with pagination, sorting, and search
- 🔍 **Smart Search** — Search by patient name or 14-digit national ID
- 📄 **Patient Details** — View complete medical history including investigations and medications

### Medical Data Tracking
- 🧪 **Investigations** — Track laboratory tests and medical investigations
- 💊 **Medications** — Manage prescribed medications and dosages
- 🔄 **Atomic Transactions** — All data saved atomically (all-or-nothing integrity)

### Multi-User System
- 👨‍⚕️ **Role-Based Access** — Doctor, Pharmacist, Clinic Staff, Administrator
- 🔐 **Secure Authentication** — Email verification and token-based API auth
- 👤 **User Management** — Create, edit, and delete staff accounts

### AI Medical Assistant
- 🤖 **AI-Powered Chatbot** — Provides medical guidance using patient history context
- 🌐 **Arabic Language Support** — Primary language with UTF-8 encoding
- ⚠️ **Emergency Detection** — Recognizes urgent situations and advises immediate care
- 🔒 **Privacy Protection** — Only accesses public patient information

---

## 📸 Screenshots

> *[Add screenshots of your application here]*

---

## 🛠 Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| PHP | 8.2+ | Server-side language |
| Laravel | 12.x | Web framework |
| Laravel Sanctum | 4.0 | API authentication |
| Laravel Breeze | 2.4 | Auth scaffolding |
| Eloquent ORM | — | Database ORM |
| SQLite | Default | Development database |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.2 | UI library |
| Inertia.js | 2.0 | Server-driven React |
| Vite | 7.0 | Build tool |
| Tailwind CSS | 3.2 | Styling framework |
| Axios | 1.11 | HTTP client |

### AI Integration
| Technology | Purpose |
|---|---|
| Ollama Cloud | AI model hosting |
| qwen3-coder:30b | Default AI model |
| Guzzle HTTP | API client |

### Development Tools
| Tool | Version | Purpose |
|---|---|---|
| Laravel Pint | 1.24 | PHP code linter |
| PHPUnit | 11.5 | Unit testing |
| npm | — | Package management |

---

## 🚀 Installation

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js & npm
- SQLite (or MySQL/PostgreSQL)

### Step-by-Step Setup

```bash
# 1. Clone the repository
git clone https://github.com/Programme319/graduation-project-clinic-system.git
cd graduation-project-clinic-system

# 2. Install PHP dependencies
composer install

# 3. Install JavaScript dependencies
npm install

# 4. Create environment file
cp .env.example .env

# 5. Generate application key
php artisan key:generate

# 6. Configure your database in .env
# DB_CONNECTION=sqlite
# DB_DATABASE=database/database.sqlite

# 7. Run database migrations
php artisan migrate

# 8. Build frontend assets
npm run build

# 9. Start the development server
php artisan serve
```

The application will be available at `http://localhost:8000`.

### Quick Development Mode
```bash
# Run both Laravel and Vite dev servers
npm run dev
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file with the following key settings:

```env
# Application
APP_NAME="Clinic System"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost

# Database (SQLite for development)
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

# Session & Cache
SESSION_DRIVER=database
SESSION_LIFETIME=120
CACHE_STORE=database
QUEUE_CONNECTION=database

# AI Integration (Ollama Cloud)
OLLAMA_API_KEY=your_api_key_here
OLLAMA_BASE_URL=https://ollama.com/api
OLLAMA_MODEL=qwen3-coder:30b

# Mail (for verification)
MAIL_MAILER=log
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_FROM_ADDRESS=hello@example.com
```

### Switching to MySQL/PostgreSQL

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=clinic
DB_USERNAME=root
DB_PASSWORD=your_password
```

---

## 📡 API Documentation

### Authentication
All protected routes require authentication via Laravel Sanctum.

### Patient Endpoints

#### List All Patients
```http
GET /patients
```
**Query Parameters:**
| Parameter | Type | Description |
|---|---|---|
| `search` | string | Search by name or national ID |

**Response:** Patient list with pagination

---

#### Create Patient
```http
POST /patient/store
```
**Request Body:**
```json
{
  "full_name": "Patient Name",
  "national_id": "12345678901234",
  "age": 30,
  "clinic_code": "CARD-001",
  "complaint": "Chest pain",
  "diagnosis_text": "Hypertension",
  "doctor_name": "Dr. Ahmed",
  "pharmacist_name": "Ph. Sara",
  "investigations": [
    {
      "test_code": "CBC",
      "test_name": "Complete Blood Count",
      "test_result": "Normal"
    }
  ],
  "medications": [
    {
      "med_code": "MED-001",
      "med_name": "Amlodipine",
      "dosage": "5mg once daily"
    }
  ]
}
```

**Validation Rules:**
- `full_name`: required, string, max:255
- `national_id`: required, string, exactly 14 digits, unique
- `age`: required, integer
- `diagnosis_text`: nullable, string

---

#### View Patient Details
```http
GET /patient/{patient}
```
**Response:** Complete patient data with investigations and medications

---

### AI Chatbot Endpoints

#### Send Message to Chatbot
```http
POST /api/chat
```
**Request Body:**
```json
{
  "patient_id": 1,
  "message": "What should I know about my diagnosis?"
}
```

**Validation:**
- `patient_id`: required, integer, exists in patients table
- `message`: required, string, max:2000 characters

**Response:**
```json
{
  "success": true,
  "reply": "AI-generated medical guidance in Arabic"
}
```

---

#### Get Patient Public Info
```http
GET /api/patient/{patientId}
```
**Response:** Public patient fields (id, full_name, age, diagnosis_text, doctor_name, complaint)

---

### User Management Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/users/create` | Show create staff form | Required |
| POST | `/users/store` | Save new staff member | Required |
| GET | `/profile` | Edit user profile | Required |
| PATCH | `/profile` | Update profile | Required |
| DELETE | `/profile` | Delete account | Required |

---

## 🗄 Database Schema

### Patients Table
| Column | Type | Description |
|---|---|---|
| `id` | bigint | Ticket Number (رقم التذكرة) |
| `full_name` | string | Patient name (اسم المريض) |
| `national_id` | string(14) | National ID, unique (الرقم القومي) |
| `age` | integer | Patient age (العمر) |
| `clinic_code` | string | Clinic code (العيادة) |
| `complaint` | text | Chief complaint (شكوى المريض) |
| `diagnosis_text` | text | Medical diagnosis (التشخيص) |
| `doctor_name` | string | Treating doctor (اسم الطبيب) |
| `pharmacist_name` | string | Pharmacist (اسم الصيدلي) |
| `timestamps` | datetime | Created/updated times |

### Patient Investigations Table
| Column | Type | Description |
|---|---|---|
| `id` | bigint | Primary key |
| `patient_id` | bigint | Foreign key → patients.id |
| `test_code` | string | Test code |
| `test_name` | string | Test name |
| `test_result` | text | Test result |

### Patient Medications Table
| Column | Type | Description |
|---|---|---|
| `id` | bigint | Primary key |
| `patient_id` | bigint | Foreign key → patients.id |
| `med_code` | string | Medication code |
| `med_name` | string | Medication name |
| `dosage` | string | Dosage information |

---

## 👥 User Roles

| Role | Permissions |
|---|---|
| **Administrator** | Full system access, user management |
| **Doctor** | Create/view patients, add diagnosis, prescribe medications |
| **Pharmacist** | View patients, manage medications |
| **Clinic Staff** | View patients, assist with records |

---

## 🤖 AI Chatbot

### Overview
The AI Medical Assistant provides supportive medical guidance to patients using their medical history context. It is **not a replacement for professional medical diagnosis**.

### Features
- ✅ Answers general health questions in **Arabic**
- ✅ Uses patient medical history for context-aware responses
- ✅ Encourages doctor follow-ups
- ✅ Detects emergency situations and advises immediate care
- ✅ Only accesses public patient information (privacy protected)

### Configuration
```env
OLLAMA_API_KEY=your_key
OLLAMA_BASE_URL=https://ollama.com/api
OLLAMA_MODEL=qwen3-coder:30b
```

### Safety Guidelines
- The chatbot provides **supportive guidance only**, not diagnoses
- Always encourages consulting a doctor for serious concerns
- Detects emergency keywords and advises immediate medical attention

---

## 🔒 Security

| Feature | Implementation |
|---|---|
| Authentication | Laravel Sanctum + Session Management |
| Email Verification | Required for account activation |
| Password Hashing | Bcrypt (12 rounds) |
| Data Validation | Strict rules on all endpoints |
| CSRF Protection | Enabled on all forms |
| Database Transactions | Atomic saves for data integrity |
| API Rate Limiting | Prevents endpoint abuse |
| Data Privacy | Chatbot limited to public patient info only |

---

## 💻 Development

### Available Commands

```bash
# Start development servers
npm run dev

# Build for production
npm run build

# Run tests
composer test

# Code linting
./vendor/bin/pint

# Database operations
php artisan migrate:fresh --seed
php artisan db:seed
```

### File Structure
```
├── app/
│   ├── Http/Controllers/    # Application controllers
│   ├── Http/Middleware/     # Custom middleware
│   ├── Http/Requests/       # Form request validation
│   ├── Models/              # Eloquent models
│   ├── Services/            # Business logic (OllamaService)
│   └── Providers/           # Service providers
├── resources/
│   ├── js/                  # React components & pages
│   │   ├── Components/      # Reusable components (ChatWidget)
│   │   └── Pages/Patient/   # Patient pages
│   ├── css/                 # Tailwind CSS styles
│   └── views/               # Blade templates
├── routes/                  # Route definitions
├── database/
│   ├── migrations/          # Schema changes
│   └── seeders/             # Seed data
├── tests/                   # PHPUnit tests
└── config/                  # Configuration files
```

---

## 🧪 Testing

```bash
# Run all tests
composer test

# Run specific test
./vendor/bin/phpunit --filter TestName

# Run with coverage
./vendor/bin/phpunit --coverage-html coverage
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code passes linting:
```bash
./vendor/bin/pint
```

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Laravel](https://laravel.com) — The PHP framework for web artisans
- [React](https://react.dev) — A JavaScript library for building user interfaces
- [Tailwind CSS](https://tailwindcss.com) — A utility-first CSS framework
- [Ollama](https://ollama.com) — AI model hosting platform

---

## 📞 Support

For issues, questions, or contributions, please open an issue on the [GitHub repository](https://github.com/Programme319/graduation-project-clinic-system).

---

<p align="center">
  Made with ❤️ for better healthcare management
</p>
