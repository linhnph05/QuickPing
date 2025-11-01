# 🚀 Deployment Guide - QuickPing

## Tóm tắt
- **Frontend:** Vercel (tự động build và chạy)
- **Backend:** Railway/Render/Heroku (cần deploy riêng)
- **Sau khi deploy:** Không cần run manual, tự động chạy 24/7

## Backend Deployment

### Option 1: Railway (Recommended - Free tier)

1. Tạo tài khoản tại https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Chọn repository `quickping`, chọn folder `backend`
4. Set environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
5. Railway tự động detect `package.json` và start với `npm start`
6. Lấy URL: `https://your-app.up.railway.app`

### Option 2: Render

1. Tạo tài khoản tại https://render.com
2. Click "New" → "Web Service"
3. Connect GitHub repo, chọn folder `backend`
4. Settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Set environment variables
6. Deploy!

### Update CORS

Sau khi có backend URL, update `backend/server.js`:
```javascript
const allowedOrigins = [
  'https://your-app.vercel.app', // Vercel URL
  'http://localhost:3000', // Dev
];
```

## Frontend Deployment (Vercel)

1. Tạo tài khoản tại https://vercel.com
2. Click "Add New" → "Project"
3. Import GitHub repository
4. Settings:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build` (auto-detect)
   - Output Directory: `.next` (auto-detect)
5. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
   ```
6. Deploy!

## Sau khi deploy

✅ **Không cần run `npm run dev` hay `npm start`**
✅ Tự động chạy khi có traffic
✅ Auto-restart khi có lỗi
✅ Scale tự động

## Test

1. Mở frontend URL: `https://your-app.vercel.app`
2. Test login/register
3. Test realtime messaging
4. Check console logs trên Vercel và Railway dashboard

