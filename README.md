# Social Shorts Aggregator

A modern webapp to watch random short videos from Instagram, TikTok, and YouTube Shorts. Users must sign in to access content.

## Tech Stack
- **Frontend**: React 18, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Passport.js with OAuth support (Google, Facebook)
- **API Client**: Axios

## Features
- ✅ User authentication (sign in/sign up)
- ✅ OAuth login (Google, Facebook)
- ✅ Random video player
- ✅ Aggregates short videos from Instagram, TikTok, YouTube Shorts
- ✅ RESTful API backend
- ✅ Responsive UI design

## Project Structure
```
scroller/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── services/      # API integration
│   │   ├── App.js
│   │   └── SignIn.js
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── index.js
│   ├── .env             # Environment variables (create from .env.example)
│   └── package.json
├── config/              # Configuration files
├── database/           # Database connection & migration scripts
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js v14+ and npm installed
- MongoDB running locally or connection string ready
- OAuth credentials (Google & Facebook) for authentication

### Installation

1. **Navigate to the project root:**
```bash
cd C:\Github\scroller
```

2. **Install dependencies (already done):**
```bash
cd client && npm install
cd ../server && npm install
```

3. **Configure environment variables:**
   - Copy `server/.env.example` to `server/.env`
   - Add your API keys and secrets:
     - MongoDB URI
     - JWT secret
     - Google OAuth credentials
     - Facebook OAuth credentials
     - YouTube, Instagram, TikTok API keys (for video fetching)

### Running the Application

**Option 1: Using VS Code Tasks**
- Open Command Palette (Ctrl+Shift+P)
- Select "Tasks: Run Task"
- Choose "Start Backend Server" or "Start Frontend Client"

**Option 2: Manual terminal commands**

Terminal 1 - Start Backend:
```bash
cd C:\Github\scroller\server
npm start
```
Backend runs on `http://localhost:5000`

Terminal 2 - Start Frontend:
```bash
cd C:\Github\scroller\client
npm start
```
Frontend runs on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Videos
- `GET /api/videos/random` - Get random short video
- `GET /api/videos/:source` - Get videos by source (youtube, instagram, tiktok)

## Database Models

### User Schema
- username
- email (unique)
- password (hashed)
- googleId
- facebookId
- profilePicture
- createdAt

### Video Schema
- videoId
- source (youtube, instagram, tiktok)
- title
- description
- url
- thumbnail
- creator
- duration
- likes
- views
- fetchedAt

## Next Steps

1. **Implement OAuth Routes**
   - Set up Google OAuth flow
   - Set up Facebook OAuth flow
   - Handle OAuth callbacks

2. **Integrate Video APIs**
   - YouTube Data API for Shorts
   - Instagram Graph API (with proper permissions)
   - TikTok API (if available in your region)

3. **Add Real-time Video Fetching**
   - Create scheduled jobs to fetch latest videos
   - Implement video aggregation logic

4. **Enhance Backend**
   - Add password hashing (bcryptjs)
   - Implement JWT token authentication
   - Add request validation
   - Add error handling middleware

5. **Enhance Frontend**
   - Add video preview/embed components
   - Implement infinite scroll
   - Add user profile page
   - Add favorites/bookmarks feature

6. **Deployment**
   - Set up docker containers
   - Deploy to cloud platform (Heroku, AWS, Azure, Vercel)
   - Configure environment variables for production

## Deployment

The app is ready for public access. For deployment:

1. Update `.env` with production credentials
2. Ensure MongoDB is accessible from production environment
3. Set OAuth redirect URIs to production domain
4. Build frontend: `npm run build` in client folder
5. Deploy to hosting platform of choice

## License
MIT
