# Symptomatic - A Healthcare Symptom Checker

A simple **AI-powered healthcare symptom checker** built with **Next.js**, **Node.js**, and **MongoDB**, using **Google Gemini** for reasoning and suggestions.  
It allows users to input symptoms and get **possible conditions** and **recommended next steps** (for **educational purposes only**, not medical advice).  

---

## Project Overview

This project demonstrates a full-stack AI integration workflow:

- **Frontend:** Built using **Next.js**, **Tailwind CSS**, and **shadcn/ui**  
  - Lets users input symptoms  
  - Displays AI-generated suggestions  
  - Shows past query history  

- **Backend:** Built with **Node.js**, **Express**, and **MongoDB (Mongoose)**  
  - Accepts user symptom data  
  - Calls **Gemini API** for LLM-based suggestions  
  - Stores query + result history in MongoDB  
  - Provides history fetching endpoint  

---

## Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | Next.js, Tailwind CSS, shadcn/ui |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose |
| **LLM** | Google Gemini API |
| **HTTP Client** | Axios |
| **Environment Management** | dotenv |
| **CORS** | Configured with client URL whitelist |

---

## 🚀 Quickstart

### Clone the Repository

```bash
git clone https://github.com/<your-username>/healthcare-symptom-checker.git
cd healthcare-symptom-checker
```

### Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder
```bash
PORT=5000
MONGO_URI=your_mongodb_uri_here
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:3000
```
Generate Gemini API keys using [Google AI Studio](https://aistudio.google.com/) 

### Setup Frontend
```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend folder
```bash
NEXT_PUBLIC_API_URL=url_to_backend/api
```

### Running
Run the frontend
```bash
cd frontend && npm run dev
```
Run the backend 
(in another terminal)
```bash
cd backend && npm run dev
```

