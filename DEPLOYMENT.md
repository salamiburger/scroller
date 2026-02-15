# Deployment Guide: Social Shorts Aggregator

This guide will help you deploy the Social Shorts Aggregator to production using:
- **Frontend**: Vercel (free)
- **Backend**: Render.com (free tier)
- **Database**: MongoDB Atlas (free tier)

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new project and cluster (free M0 tier)
4. In "Database Access", create a database user with username/password
5. In "Network Access", add your IP address (or allow all: 0.0.0.0/0)
6. Click "Connect" and choose "Connect your application"
7. Copy the connection string: `mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>`
8. Keep this URI safe - you'll need it for backend deployment

## Step 2: Deploy Backend (Render.com)

1. Go to [Render.com](https://render.com) and sign up
2. Click "New +" and select "Web Service"
3. Choose "Deploy an existing Git repository" or paste your GitHub repo URL
4. Set up the service:
   - **Name**: social-shorts-api
   - **Environment**: Node
   - **Region**: Choose nearest to your users
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
5. Add environment variables: Click "Add Environment Variable" for each:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate a random string (use: https://generate-random.org/)
   - `PORT`: 5000
   - `CORS_ORIGIN`: Your Vercel frontend URL (you'll get this in Step 3)
   - Add any other API keys (Google OAuth, Facebook, YouTube, etc.)
6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL (e.g., `https://social-shorts-api.onrender.com`)

## Step 3: Deploy Frontend (Vercel)

1. Go to [Vercel.com](https://vercel.com) and sign up with GitHub
2. Click "New Project"
3. Import your GitHub repository (link it first if needed)
4. Set up:
   - **Framework**: React
   - **Root Directory**: ./client
5. Add environment variables:
   - `REACT_APP_API_URL`: Your Render backend URL (e.g., `https://social-shorts-api.onrender.com/api`)
6. Click "Deploy"
7. Vercel will automatically build and deploy
8. You'll get a URL like: `https://social-shorts.vercel.app`

## Step 4: Update Backend CORS

After getting your Vercel frontend URL, update your backend:

1. Go to Render dashboard
2. Click your service
3. Click "Environment" in the sidebar
4. Update `CORS_ORIGIN`: Set to your Vercel URL (e.g., `https://social-shorts.vercel.app`)
5. Click "Deploy" to redeploy with updated settings

## Step 5: Configure OAuth Providers

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable "Google+ API"
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Set authorized redirect URIs:
   - Development: `http://localhost:5000`
   - Production: `https://your-backend-url.onrender.com`
6. Copy Client ID and Client Secret to backend environment variables:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

### Facebook OAuth
1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create an app
3. Add "Facebook Login" product
4. In Settings → Basic, copy App ID and App Secret
5. Add Valid OAuth Redirect URIs:
   - `https://your-backend-url.onrender.com/auth/facebook/callback`
6. Set environment variables:
   - `FACEBOOK_APP_ID`
   - `FACEBOOK_APP_SECRET`

## Step 6: Verify Deployment

1. Open your Vercel frontend URL
2. Test the sign-in page
3. Test API connectivity (should connect to Render backend)
4. Monitor logs in Render dashboard for any errors

## Troubleshooting

### Backend not responding
- Check Render logs: Click your service → "Logs"
- Verify MongoDB connection string in environment variables
- Ensure IP whitelist includes your region on MongoDB Atlas

### Frontend can't reach backend
- Check `REACT_APP_API_URL` environment variable on Vercel
- Verify backend URL is correct (with `/api` suffix)
- Check CORS_ORIGIN on backend matches frontend URL

### Build failures
- Check build logs in Vercel/Render dashboards
- Ensure all dependencies are listed in package.json
- Verify no hardcoded localhost references

## Custom Domain Setup

After deployment, you can add custom domains:

**Frontend (Vercel)**:
1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions

**Backend (Render)**:
1. Go to Service Settings → Custom Domain
2. Add your domain
3. Follow DNS configuration instructions

## Monitoring

**Vercel Analytics**: Built-in to dashboard
**Render Logs**: Check service logs for errors
**MongoDB Atlas**: Monitor database metrics under "Metrics" tab

## Cost Estimates (Monthly)

- **Vercel**: Free tier (up to 100GB bandwidth)
- **Render**: Free tier ($0/month for web service)
- **MongoDB Atlas**: Free tier ($0/month, 512MB storage)

**Total: FREE** until you exceed free tier limits

## Next Steps

1. Implement real API endpoints using actual video sources
2. Add email verification for user registration
3. Implement password reset functionality
4. Set up automated database backups
5. Add monitoring and alerting
6. Implement rate limiting to prevent abuse
