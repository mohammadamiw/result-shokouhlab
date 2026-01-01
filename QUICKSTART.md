# راهنمای سریع شروع 🚀

## نصب سریع (5 دقیقه)

### 1. Backend
```bash
npm install
copy .env.example .env
# ویرایش .env و وارد کردن اطلاعات سیستم آزمایشگاه
npm start
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. استفاده
- باز کردن مرورگر: `http://localhost:3000`
- وارد کردن کد ملی و رمز عبور
- مشاهده داشبورد!

## تنظیمات ضروری در `.env`

```env
LAB_API_BASE_URL=http://YOUR_LAB_SERVER_IP:PORT
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## تست سریع API

```bash
# Health check
curl http://localhost:3001/health

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"nationalId":"1234567890","password":"test"}'
```

## مشکلات رایج

**Backend اجرا نمی‌شود؟**
- Node.js 18+ نصب شده؟
- پورت 3001 آزاد است؟

**Frontend به Backend وصل نمی‌شود؟**
- Backend اجرا شده؟
- `VITE_API_URL` درست تنظیم شده؟

**Encoding مشکل دارد؟**
- در `utils/dataTransformer.js` encoding را تغییر دهید

برای جزئیات بیشتر، `SETUP.md` را بخوانید.

