import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { labAuthService } from './services/labAuthService.js';
import { labDataService } from './services/labDataService.js';
import { dataTransformer } from './utils/dataTransformer.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Lab Middleware API is running' });
});

// Authentication endpoint - دریافت توکن از سیستم آزمایشگاه
app.post('/api/auth/login', async (req, res) => {
  try {
    const { nationalId, password } = req.body;

    if (!nationalId || !password) {
      return res.status(400).json({ 
        error: 'کد ملی و رمز عبور الزامی است' 
      });
    }

    // دریافت توکن از سیستم آزمایشگاه
    const token = await labAuthService.getToken(nationalId, password);
    
    if (!token) {
      return res.status(401).json({ 
        error: 'احراز هویت ناموفق - کد ملی یا رمز عبور اشتباه است' 
      });
    }

    res.json({ 
      success: true, 
      token: token,
      message: 'ورود موفقیت‌آمیز بود' 
    });
  } catch (error) {
    console.error('Authentication error:', error);
    
    // تعیین کد وضعیت مناسب بر اساس نوع خطا
    let statusCode = 500;
    let errorMessage = 'خطا در ارتباط با سیستم آزمایشگاه';
    
    // اگر خطای مشخصی از labAuthService آمده باشد، از آن استفاده می‌کنیم
    if (error.message) {
      errorMessage = error.message;
      
      // اگر خطا مربوط به احراز هویت باشد
      if (error.message.includes('کد ملی') || error.message.includes('رمز عبور')) {
        statusCode = 401;
      } else if (error.message.includes('ارتباط') || error.message.includes('زمان')) {
        statusCode = 503; // Service Unavailable
      } else if (error.message.includes('یافت نشد')) {
        statusCode = 404;
      }
    }
    
    res.status(statusCode).json({ 
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// دریافت تمام آزمایش‌های بیمار - گروه‌بندی شده بر اساس پذیرش
app.post('/api/patient/tests', async (req, res) => {
  try {
    const { token, nationalId, password } = req.body;

    // اعتبارسنجی پارامترها
    if (!token) {
      return res.status(400).json({ 
        success: false,
        error: 'توکن الزامی است' 
      });
    }

    if (!nationalId || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'کد ملی و رمز عبور الزامی است' 
      });
    }

    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📋 درخواست دریافت تمام آزمایش‌ها');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('🆔 کد ملی:', nationalId);
    console.log('🔑 توکن: ✓');
    console.log('');

    // استفاده از متد زنجیره‌ای - دریافت تمام پذیرش‌ها و آزمایش‌ها
    const result = await labDataService.getPatientTestsChained(token, nationalId, password);
    
    // بررسی نتایج
    if (!result.admissions || result.admissions.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'هیچ آزمایشی یافت نشد' 
      });
    }

    console.log('');
    console.log(`✅ ${result.summary.totalAdmissions} پذیرش با ${result.summary.totalTests} آزمایش ارسال شد`);

    res.json({
      success: true,
      summary: result.summary,
      admissions: result.admissions
    });

  } catch (error) {
    console.error('');
    console.error('════════════════════════════════════════════════════════════════');
    console.error('❌ خطا در دریافت آزمایش‌ها:', error.message);
    console.error('════════════════════════════════════════════════════════════════');
    console.error('');
    
    // تعیین کد وضعیت بر اساس نوع خطا
    let statusCode = 500;
    if (error.message.includes('توکن منقضی')) {
      statusCode = 401;
    } else if (error.message.includes('یافت نشد')) {
      statusCode = 404;
    }

    res.status(statusCode).json({ 
      success: false,
      error: error.message || 'خطا در دریافت داده‌های آزمایشگاه'
    });
  }
});

// دریافت جزئیات یک آزمایش خاص
app.post('/api/patient/test-details', async (req, res) => {
  try {
    const { token, nationalId, testId } = req.body;

    if (!token || !nationalId || !testId) {
      return res.status(400).json({ 
        error: 'توکن، کد ملی و شناسه آزمایش الزامی است' 
      });
    }

    const rawData = await labDataService.getTestDetails(token, nationalId, testId);
    const cleanData = dataTransformer.transformTestDetails(rawData);

    res.json({
      success: true,
      data: cleanData
    });
  } catch (error) {
    console.error('Test details error:', error);
    res.status(500).json({ 
      error: 'خطا در دریافت جزئیات آزمایش',
      details: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'خطای سرور',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🚀 Lab Middleware API');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`📡 Middleware Port: ${PORT}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log('');
  console.log('🔗 ParsiPol Lab System (Port 8090):');
  console.log('   🔐 Auth: http://80.210.56.217:8090/api/v1/auth/auth');
  console.log('   📊 Data: http://80.210.56.217:8090/api/v1/shared/patientInfo/detail/detailMonitoring');
  console.log('');
  console.log('✅ Server is ready to accept requests');
  console.log('═══════════════════════════════════════════════════════════════');
});

