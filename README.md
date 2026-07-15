# ResumeForge - AI-Powered Resume Builder

🚀 **Live Demo**: [https://frontend-psi-green-80.vercel.app](https://frontend-psi-green-80.vercel.app)
⚙️ **Backend API**: [https://resume-forge-backend-h92i.onrender.com](https://resume-forge-backend-h92i.onrender.com)

A modern, full-stack application that helps users create professional resumes using LaTeX and AI (Google Gemini). It allows users to write their resumes in LaTeX with real-time live preview, get AI feedback and scoring on their resume, and automatically tailor their resume to a specific job description.

## Features

- **Live LaTeX Compilation**: Real-time side-by-side preview of your LaTeX resume.
- **AI Feedback & Scoring**: Powered by Gemini 3.5 Flash, get instant actionable feedback on your resume broken down by sections (e.g. Header, Experience, Education) along with an ATS score out of 100.
- **AI Job Tailoring**: Paste a job description and ResumeForge will intelligently modify your LaTeX code to highlight relevant experience, matching your skills directly to the role.
- **Secure Authentication**: JWT-based authentication allows users to securely save and manage multiple versions of their resumes.

## Architecture

This project is built using a modern full-stack architecture:
- **Frontend**: React, Vite, Tailwind CSS, Monaco Editor (for LaTeX editing).
- **Backend**: Node.js, Express, TypeScript, Prisma (SQLite/PostgreSQL).
- **AI Integration**: Google GenAI SDK (Gemini 3.5 Flash).
- **Containerization**: Docker (Backend includes a fully containerized TeX Live distribution).

## Local Setup

### Prerequisites
- Node.js (v20+)
- Docker (for local LaTeX compilation)
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/resume-forge.git
   cd resume-forge
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=3001
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="super-secret-key"
   GEMINI_API_KEY="your-gemini-api-key"
   ```
   Generate the Prisma client and push the schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
   Start the backend (using Docker to ensure TeX Live is available):
   ```bash
   docker-compose up backend
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory (optional):
   ```env
   VITE_API_URL=http://localhost:3001
   ```
   Start the frontend:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## Deployment

- **Frontend**: Deployed on Vercel.
- **Backend**: Containerized and deployed on Render as a Web Service.

## License
MIT License
