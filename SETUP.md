# راهنمای نصب و راه‌اندازی کامل پروژه

این راهنما به شما کمک می‌کند که کل پروژه را از صفر راه‌اندازی کنید.

## 📋 پیش‌نیازها

- **Node.js 18+** و npm
- دسترسی به سیستم آزمایشگاه (IP و Port)
- اطلاعات احراز هویت سیستم آزمایشگاه

## 🚀 مراحل نصب

### مرحله 1: نصب Backend

```bash
# نصب وابستگی‌ها
npm install

# کپی فایل تنظیمات
# در Windows:
copy .env.example .env
# در Linux/Mac:
cp .env.example .env
```

### مرحله 2: تنظیم Backend

فایل `.env` را ویرایش کنید و اطلاعات سیستم آزمایشگاه را وارد کنید:

```env
LAB_API_BASE_URL=http://192.168.1.100:8080
LAB_API_AUTH_ENDPOINT=/api/auth
LAB_API_DATA_ENDPOINT=/api/patient-data
LAB_SYSTEM_USERNAME=your_username
LAB_SYSTEM_PASSWORD=your_password
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**⚠️ مهم:** 
- `LAB_API_BASE_URL` باید آدرس واقعی سرور آزمایشگاه باشد
- اگر سیستم آزمایشگاه از SSL خودامضا استفاده می‌کند، باید در `labAuthService.js` و `labDataService.js` تنظیمات SSL را تغییر دهید

### مرحله 3: تست Backend

```bash
# اجرای Backend
npm start

# یا برای development با auto-reload:
npm run dev
```

Backend باید روی `http://localhost:3001` اجرا شود.

برای تست:
```bash
curl http://localhost:3001/health
```

باید پاسخ `{"status":"ok","message":"Lab Middleware API is running"}` را ببینید.

### مرحله 4: نصب Frontend

```bash
cd frontend
npm install
```

### مرحله 5: تنظیم Frontend (اختیاری)

اگر Backend روی آدرس یا پورت دیگری اجرا می‌شود، فایل `.env` در پوشه `frontend` بسازید:

```env
VITE_API_URL=http://localhost:3001
```

### مرحله 6: اجرای Frontend

```bash
npm run dev
```

Frontend روی `http://localhost:3000` اجرا می‌شود.

## 🧪 تست کامل سیستم

### 1. تست احراز هویت

با استفاده از Postman یا curl:

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"nationalId":"1234567890","password":"test_password"}'
```

اگر موفق باشد، باید یک `token` دریافت کنید.

### 2. تست دریافت داده

```bash
curl -X POST http://localhost:3001/api/patient/tests \
  -H "Content-Type: application/json" \
  -d '{"token":"YOUR_TOKEN","nationalId":"1234567890"}'
```

### 3. تست Frontend

1. مرورگر را باز کنید و به `http://localhost:3000` بروید
2. با کد ملی و رمز عبور یک بیمار واقعی وارد شوید
3. داشبورد باید نمایش داده شود

## 🔧 تنظیمات پیشرفته

### اگر سیستم آزمایشگاه XML می‌دهد

در `utils/dataTransformer.js`، بخش `transformTests` را ویرایش کنید و یک XML parser اضافه کنید:

```javascript
import { parseString } from 'xml2js';

// در transformTests:
if (data.startsWith('<?xml')) {
  // Parse XML
  parseString(data, (err, result) => {
    // تبدیل XML به JSON
  });
}
```

### اگر Encoding دیگری استفاده می‌شود

در `utils/dataTransformer.js`، تابع `fixEncoding` را ویرایش کنید و encoding‌های دیگر را امتحان کنید:

```javascript
// اضافه کردن encoding جدید
decoded = iconv.decode(Buffer.from(text, 'binary'), 'windows-1252');
```

### اگر سیستم آزمایشگاه از Basic Auth استفاده می‌کند

در `services/labAuthService.js` و `labDataService.js`:

```javascript
headers: {
  'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
}
```

## 🐛 عیب‌یابی

### مشکل: "ارتباط با سیستم آزمایشگاه برقرار نشد"

**راه‌حل:**
1. بررسی کنید که `LAB_API_BASE_URL` صحیح است
2. بررسی کنید که سرور آزمایشگاه در دسترس است:
   ```bash
   ping LAB_SERVER_IP
   ```
3. بررسی کنید که firewall اجازه اتصال می‌دهد

### مشکل: "Token not found in response"

**راه‌حل:**
1. پاسخ سیستم آزمایشگاه را بررسی کنید
2. در `labAuthService.js`، بخش استخراج token را با فرمت واقعی پاسخ تطبیق دهید

### مشکل: Encoding هنوز درست نیست

**راه‌حل:**
1. یک نمونه از داده خام را log کنید
2. Encoding واقعی را شناسایی کنید
3. در `dataTransformer.js` encoding صحیح را اضافه کنید

### مشکل: CORS در Frontend

**راه‌حل:**
1. بررسی کنید که `FRONTEND_URL` در `.env` صحیح است
2. بررسی کنید که Frontend از همان URL درخواست می‌زند
3. اگر از proxy استفاده می‌کنید، `vite.config.js` را بررسی کنید

## 📦 Deploy

### Backend (Production)

```bash
# Build (اگر نیاز باشد)
# نصب dependencies
npm install --production

# اجرا با PM2 یا systemd
pm2 start server.js --name lab-middleware
```

### Frontend (Production)

```bash
cd frontend
npm run build

# فایل‌های dist را روی یک web server (nginx, Apache) قرار دهید
```

## 🔒 امنیت Production

1. **HTTPS**: حتماً از HTTPS استفاده کنید
2. **Rate Limiting**: اضافه کردن `express-rate-limit`
3. **Environment Variables**: هرگز `.env` را commit نکنید
4. **Logging**: اضافه کردن logging مناسب (Winston)
5. **Monitoring**: اضافه کردن monitoring (PM2, New Relic, etc.)

## 📞 پشتیبانی

اگر مشکلی داشتید:
1. لاگ‌های Backend را بررسی کنید
2. Console مرورگر را بررسی کنید
3. Network tab در DevTools را بررسی کنید

