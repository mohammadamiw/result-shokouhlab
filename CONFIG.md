# راهنمای تنظیمات (Configuration Guide)

## فایل `.env`

یک فایل `.env` در ریشه پروژه بسازید و محتوای زیر را در آن قرار دهید:

```env
# Lab System Configuration
# آدرس‌های واقعی سیستم آزمایشگاه
LAB_AUTH_URL=http://80.210.56.217:8090/api/v1/auth/auth
LAB_DATA_URL=http://80.210.56.217:8085/Service1.asmx/Web_GetAdmitList

# پسورد انکریپت شده سیستم آزمایشگاه (اگر نیاز باشد)
# این پسورد برای احراز هویت با سیستم آزمایشگاه استفاده می‌شود
# اگر این مقدار تنظیم شود، از آن استفاده می‌شود، در غیر این صورت از پسورد کاربر استفاده می‌شود
LAB_ENCRYPTED_PASSWORD=your_encrypted_password_here

# User Name سیستم آزمایشگاه (اختیاری - پیش‌فرض: AngularWeb)
# این فیلد در بدنه درخواست احراز هویت ارسال می‌شود
LAB_SYSTEM_USERNAME=AngularWeb

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Logging (اختیاری)
LOG_LEVEL=info

# Test Configuration (برای فایل test-get-data.js)
TEST_NATIONAL_ID=1234567890
TEST_PATIENT_PASSWORD=patient_password_here
```

## توضیحات متغیرها

### `LAB_ENCRYPTED_PASSWORD`
پسورد انکریپت شده‌ای که قبلاً از سیستم آزمایشگاه دریافت کرده‌اید. اگر این مقدار تنظیم شود، در هنگام احراز هویت از این پسورد استفاده می‌شود. در غیر این صورت، از پسوردی که کاربر وارد می‌کند استفاده می‌شود.

**نکته مهم:** این پسورد را در فایل `.env` قرار دهید و هرگز آن را در کد hardcode نکنید یا در Git commit نکنید.

### `LAB_SYSTEM_USERNAME`
نام کاربری سیستم که در بدنه درخواست احراز هویت ارسال می‌شود. پیش‌فرض: `AngularWeb`. اگر این مقدار در `.env` تنظیم نشود، از مقدار پیش‌فرض استفاده می‌شود.

### `LAB_AUTH_URL`
آدرس کامل endpoint احراز هویت سیستم آزمایشگاه:
```
http://80.210.56.217:8090/api/v1/auth/auth
```

### `LAB_DATA_URL`
آدرس کامل endpoint دریافت لیست آزمایش‌ها:
```
http://80.210.56.217:8085/Service1.asmx/Web_GetAdmitList
```

### `PORT`
پورت که Backend روی آن اجرا می‌شود (پیش‌فرض: 3001)

### `FRONTEND_URL`
آدرس Frontend React (برای تنظیمات CORS)

### `TEST_NATIONAL_ID`
کد ملی بیمار برای تست (استفاده در `test-get-data.js`)

### `TEST_PATIENT_PASSWORD`
پسورد بیمار برای تست (استفاده در `test-get-data.js`)

## نحوه استفاده از پسورد انکریپت شده

در فایل `services/labAuthService.js`، اگر `LAB_ENCRYPTED_PASSWORD` در `.env` تنظیم شده باشد، از آن استفاده می‌شود:

```javascript
const encryptedPassword = process.env.LAB_ENCRYPTED_PASSWORD;
const passwordToSend = encryptedPassword || password;
```

این یعنی:
- اگر `LAB_ENCRYPTED_PASSWORD` تنظیم شده باشد → از آن استفاده می‌شود
- در غیر این صورت → از پسوردی که کاربر وارد کرده استفاده می‌شود

## امنیت

⚠️ **هشدار امنیتی:**
- هرگز فایل `.env` را در Git commit نکنید
- فایل `.env` در `.gitignore` قرار دارد
- در production، از متغیرهای محیطی سیستم عامل استفاده کنید
- از HTTPS استفاده کنید

