# QuizNova AI 🧠✨

**"Learn. Challenge. Master."**

QuizNova AI is an AI-powered Quiz Management System that allows users to dynamically generate quizzes on *any* topic using Google's Gemini AI, attempt them within a set timer, track their scores, and view performance analytics over time.

## 🌟 Features
- **AI Quiz Generation**: Powered by Google Gemini AI, generate 5-20 questions dynamically on any topic (e.g., "JavaScript", "Quantum Physics", "World War II").
- **Smart Timer & Auto-Submit**: Configurable timer that automatically submits your quiz when time runs out.
- **Detailed Analytics**: Visual charts (using Recharts) tracking your performance over time and mastery across different topics.
- **AI Recommendations**: Identifies weak topics and recommends subjects to focus on.
- **Modern UI/UX**: Premium aesthetic featuring glassmorphism, gradient text, smooth animations (Framer Motion), and responsive design.
- **Authentication**: Secure JWT and bcrypt-based login/registration system.
- **Dark Mode**: Fully accessible Light and Dark modes.

## 🛠️ Technology Stack
- **Frontend**: React.js, Vite, Tailwind CSS, React Router, Axios, Framer Motion, Recharts, Lucide React.
- **Backend**: Node.js, Express.js, JWT, bcryptjs.
- **Database**: MongoDB, Mongoose.
- **AI Integration**: Google Gemini API (`@google/generative-ai`).

## 📁 Project Structure
```
quiznova-ai/
├── client/          # Vite React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/ # Auth Context
│   │   ├── layouts/ # Main & Auth Layouts
│   │   ├── pages/   # Landing, Login, Dashboard, CreateQuiz, etc.
│   │   └── ...
├── server/          # Node.js Express Backend
│   ├── config/      # MongoDB Connection
│   ├── controllers/ # Auth, Quiz, Analytics logic
│   ├── middleware/  # JWT Protection
│   ├── models/      # User, Quiz, QuizAttempt Schemas
│   ├── routes/      # API Routes
│   └── server.js
```

## 🚀 Setup & Installation

### 1. Prerequisites
- Node.js (v16+)
- MongoDB connection string (Atlas or local)
- Google Gemini API Key (Get it from [Google AI Studio](https://aistudio.google.com/))

### 2. Backend Setup
```bash
cd server
npm install

# Create a .env file based on the example
cp .env.example .env
```
Update your `server/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```
Start the server:
```bash
npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
# Client runs on http://localhost:5173
```

## 📖 How to Use
1. Open the app and register a new student account.
2. Navigate to **Create Quiz** and enter a topic (e.g., "React Hooks").
3. Choose difficulty, question count, and a timer.
4. Attempt the quiz before the time runs out.
5. Review your detailed results and view your stats in the **Analytics** tab.

---
*Built with ❤️ and AI.*
