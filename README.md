
# Green Voyage 

A full-stack eco-tourism platform focused on community-driven travel in Northeast India. The system combines a modern web stack with an AI-powered recommendation engine and chatbot service.

---

## Features

* Destination discovery across Northeast India
* Personalized recommendations using ranking algorithms
* Chatbot assistance for travel queries
* Image upload and delivery via Cloudinary CDN
* JWT-based authentication and authorization
* Community-driven posts and comments

---

## Architecture Overview

The system follows a modular, service-oriented architecture:

* **Frontend:** Next.js (App Router, React, TypeScript)
* **Backend API:** Express (Node.js) with Prisma ORM
* **AI Service:** FastAPI (Python)
* **Database:** PostgreSQL
* **Media Storage:** Cloudinary

---

## Project Structure

```text
.
├── client/                  # Next.js web application
├── apiServer/               # Express + Prisma backend
├── pythonServer/            # FastAPI AI service
├── docker-compose.yml       # Multi-service container setup
└── README.md
```

### Client

```text
client/
├── src/app/                 # App Router pages and layouts
├── src/components/          # UI components
├── src/config/axios.ts      # API configuration
├── src/hooks/               # Custom hooks
├── src/store/               # Zustand state management
├── src/types/               # Type definitions
└── public/                  # Static assets
```

### API Server

```text
apiServer/
├── src/module/auth/
├── src/module/post/
├── src/module/comments/
├── src/module/search/
├── src/module/recommendation/
├── src/module/chat/
├── src/db/
├── src/middleware/
├── prisma/
└── data.json
```

### Python Service

```text
pythonServer/ai_services/
├── main.py
├── recommender/api/
├── recommender/model/
├── recommender/chatbot/
├── recommender/utils/
└── requirements.txt
```

---

## Technology Stack

| Layer      | Technologies                                                             |
| ---------- | ------------------------------------------------------------------------ |
| Frontend   | Next.js, React, TypeScript, Tailwind CSS, Axios, Zustand                 |
| Backend    | Node.js, Express, Prisma, PostgreSQL, JWT, bcrypt, Multer, Cloudinary    |
| AI Service | FastAPI, Uvicorn, sentence-transformers, scikit-learn, PyTorch, psycopg2 |

---

## Service Communication Flow

### 1. Client to API

The Next.js client sends HTTP requests to the Express API for all user interactions.

### 2. API Responsibilities

The Express API handles:

* Authentication
* Post creation and retrieval
* Search and filtering
* Comments and user actions

### 3. Image Upload Flow (Cloudinary)

1. The client sends a `multipart/form-data` request.
2. The API processes files using middleware (e.g., Multer).
3. Files are uploaded to Cloudinary.
4. Cloudinary returns secure URLs and metadata.
5. URLs are stored in PostgreSQL via Prisma.
6. The frontend renders images directly from Cloudinary CDN.

### 4. Post Creation Sync

After a post is created, the API notifies the Python service to refresh recommendation data.

### 5. Recommendation and Chat Flow

* The API acts as a proxy.
* Requests are forwarded to the FastAPI service.
* Responses are returned to the client.

### 6. AI Service

The Python service:

* Reads data from PostgreSQL
* Applies ranking and filtering logic
* Returns recommendations and chatbot responses

### 7. Database Layer

Prisma manages schema, migrations, and queries for PostgreSQL.

---

## Installation Guide

### Prerequisites

* Node.js 22+
* Python 3.11+
* PostgreSQL
* Cloudinary account
* Groq API key

---

### 1. Clone the Repository

```bash
git clone <repo-url>
cd hackdays
```

---

### 2. Install Dependencies

```bash
cd client
npm install

cd ../apiServer
npm install

cd ../pythonServer/ai_services
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

### 3. Environment Configuration

#### client/.env

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### apiServer/.env

```env
PORT=5000
CLIENT_URL=http://localhost:3000
PYTHON_API_URL=http://localhost:8000
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRECT_KEY=replace-me
CLOUD_NAME=replace-me
CLOUD_API_KEY=replace-me
CLOUD_API_SECRET=replace-me
```

#### pythonServer/ai_services/.env

```env
DATABASE_URL=postgresql://user:password@host:5432/database
GROQ_API_KEY=replace-me
```

---

### 4. Database Setup

```bash
cd apiServer
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

---

### 5. Run Services

Open three terminals:

```bash
cd client
npm run dev
```

```bash
cd apiServer
npm run dev
```

```bash
cd pythonServer/ai_services
source .venv/bin/activate
uvicorn main:app --reload --port 8000
```

---

### 6. Access the Application

* Frontend: http://localhost:3000
* API: http://localhost:5000
* AI Service: http://localhost:8000

---

## Docker Setup

### Start All Services

```bash
docker compose up --build
```

### Services

* Frontend: port 3000
* Backend API: port 5000
* AI Service: port 8000

---

## Summary

* Next.js handles UI and client interaction
* Express API manages business logic and orchestration
* Cloudinary handles media storage and delivery
* FastAPI provides recommendation and chatbot services
* PostgreSQL with Prisma manages persistent data

---


