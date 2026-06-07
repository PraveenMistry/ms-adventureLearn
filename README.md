# ⚙️ Kids Learning Adventure - Backend API

The robust, scalable ms-adventureLearn engine for the Kids Learning Adventure Platform. Built with a focus on educational security, AI-driven content, and real-time student tracking.

## 🚀 Tech Stack
- **Runtime**: Node.js v24.12
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **Security**: JWT (JSON Web Tokens) with BcryptJS encryption
- **AI**: OpenAI API for personalized story generation
- **Messaging**: Integrated logic for Telegram-based password recovery

## ✨ Key Features & Services
- **Role-Based Auth**: Specialized flows for Teachers, Parents, and Students.
- **Mission Engine**: Backend-driven module unlocking based on curriculum progression (Typing -> Phonics -> Math -> Art -> World).
- **Security Protocols**: Magic PIN system for student profiles and math-gated access for parent stations.
- **Content Hub API**: Support for custom teacher-created Badges, Stories, and World Facts.
- **Analytics**: Real-time student leaderboard data and classroom progress tracking.
- **Streak Engine**: Automated daily streak calculation based on activity logs.

## 🛠️ Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file from `.env.example`:
   - `OPENAI_API_KEY`: For magic story generation.
   - `MONGO_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: For secure authentication.

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

4. **Build & Start (Production):**
   ```bash
   npm run build
   npm start
   ```

## 📂 Project Structure
- `src/models`: User, ChildProfile, Classroom, Badge, Reward schemas.
- `src/services`: Business logic for Auth, Profiles, Progress, and AI Stories.
- `src/controllers`: API request handlers.
- `src/routes`: Unified routing table.

## ☁️ Deployment
Optimized for deployment on **Render**:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Root Directory**: `ms-adventureLearn`
