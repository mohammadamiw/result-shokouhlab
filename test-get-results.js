import dotenv from 'dotenv';
import { labAuthService } from './services/labAuthService.js';
import { labDataService } from './services/labDataService.js';

// بارگذاری تنظیمات از .env
dotenv.config();

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║     تست دریافت نتایج آزمایش از سیستم آزمایشگاه        ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

// بررسی تنظیمات
console.log('🔍 بررسی تنظیمات...\n');

const authURL = process.env.LAB_AUTH_URL;
const encryptedPassword = process.env.LAB_ENCRYPTED_PASSWORD;
const testNationalId = process.env.TEST_NATIONAL_ID;
const testPatientPassword = process.env.TEST_PATIENT_PASSWORD;
const testAdmitId = process.env.TEST_ADMIT_ID || '29822'; // استفاده از DisplayID/SajaAdmitId
const testPatientInfoId = process.env.TEST_PATIENT_INFO_ID || '64109'; // استفاده از PRK_PatientInfo

if (!authURL) {
  console.error('❌ خطا: LAB_AUTH_URL در فایل .env تنظیم نشده است');
  process.exit(1);
}

if (!encryptedPassword) {
  console.error('❌ خطا: LAB_ENCRYPTED_PASSWORD در فایل .env تنظیم نشده است');
  process.exit(1);
}

if (!testNationalId) {
  console.error('❌ خطا: TEST_NATIONAL_ID در فایل .env تنظیم نشده است');
  process.exit(1);
}

if (!testPatientPassword) {
  console.error('❌ خطا: TEST_PATIENT_PASSWORD در فایل .env تنظیم نشده است');
  process.exit(1);
}

console.log('✅ تنظیمات پیدا شد:');
console.log(`   📍 آدرس Auth: ${authURL}`);
console.log(`   🆔 کد ملی تست: ${testNationalId}`);
console.log(`   🔐 پسورد سیستم: ${encryptedPassword.substring(0, 10)}... (مخفی)`);
console.log(`   🔑 پسورد بیمار: ${testPatientPassword.substring(0, 5)}... (مخفی)`);
console.log(`   📋 Saja Admit ID: ${testAdmitId}`);
console.log(`   📋 Patient Info ID: ${testPatientInfoId}\n`);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// مرحله 1: دریافت توکن
console.log('📝 مرحله 1: دریافت توکن از سیستم آزمایشگاه...\n');

let token = null;

try {
  token = await labAuthService.getToken(testNationalId, encryptedPassword);
  
  if (!token) {
    console.error('❌ خطا: توکن دریافت نشد');
    process.exit(1);
  }
  
  console.log('✅ توکن با موفقیت دریافت شد!');
  console.log(`🔑 توکن (اولین 50 کاراکتر): ${token.substring(0, 50)}...\n`);
} catch (error) {
  console.error('❌ خطا در دریافت توکن:', error.message);
  process.exit(1);
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// مرحله 2: دریافت نتایج آزمایش
console.log('📋 مرحله 2: دریافت نتایج آزمایش...\n');

try {
  const results = await labDataService.getTestResults(
    token,
    testAdmitId,        // SajaAdmitId
    testPatientInfoId   // PatientInfo (اختیاری - پیش‌فرض: 64109)
  );
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('✅ نتایج با موفقیت دریافت شدند!\n');
  
  console.log('📋 خلاصه:');
  console.log(`   تعداد نتایج: ${results.length}`);
  console.log(`   نوع داده: ${Array.isArray(results) ? 'Array' : typeof results}\n`);
  
  if (results.length === 0) {
    console.log('⚠️ هیچ نتیجه‌ای یافت نشد.');
    process.exit(0);
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📦 ساختار کامل نتایج (خام):\n');
  console.log(JSON.stringify(results, null, 2));
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('🔧 فرمت کردن داده‌های نهایی...\n');
  
  // فرمت کردن داده‌ها - فقط فیلدهای مهم
  const formattedResults = labDataService.formatFinalData(results);
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📦 ساختار کامل نتایج (فرمت شده):\n');
  console.log(JSON.stringify(formattedResults, null, 2));
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('🔍 بررسی فارسی‌ها و encoding:\n');
  
  // بررسی اولین نتیجه برای دیدن ساختار (خام)
  if (results.length > 0) {
    const firstResult = results[0];
    console.log('📄 اولین نتیجه (خام):');
    console.log(JSON.stringify(firstResult, null, 2));
  }
  
  // بررسی داده‌های فرمت شده
  if (formattedResults.length > 0) {
    const firstFormatted = formattedResults[0];
    console.log('\n📄 اولین نتیجه (فرمت شده):');
    console.log(JSON.stringify(firstFormatted, null, 2));
    
    console.log('\n🔤 بررسی فیلدهای متنی برای فارسی:');
    
    // بررسی فیلدهای مهم
    console.log('\n📊 فیلدهای مهم:');
    if (firstFormatted.testName) {
      const hasPersian = /[\u0600-\u06FF]/.test(firstFormatted.testName);
      console.log(`   testName: "${firstFormatted.testName}" ${hasPersian ? '✅ فارسی' : '❌ بدون فارسی'}`);
    }
    if (firstFormatted.result) {
      const hasPersian = /[\u0600-\u06FF]/.test(firstFormatted.result);
      console.log(`   result: "${firstFormatted.result}" ${hasPersian ? '✅ فارسی' : '❌ بدون فارسی'}`);
    }
    if (firstFormatted.normalRange) {
      const hasPersian = /[\u0600-\u06FF]/.test(firstFormatted.normalRange);
      console.log(`   normalRange: "${firstFormatted.normalRange}" ${hasPersian ? '✅ فارسی' : '❌ بدون فارسی'}`);
    }
    if (firstFormatted.unit) {
      const hasPersian = /[\u0600-\u06FF]/.test(firstFormatted.unit);
      console.log(`   unit: "${firstFormatted.unit}" ${hasPersian ? '✅ فارسی' : '❌ بدون فارسی'}`);
    }
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('✅ تست با موفقیت انجام شد!\n');
  
} catch (error) {
  console.error('\n❌ خطا در دریافت نتایج:', error.message);
  console.error('\n📋 جزئیات خطا:');
  if (error.stack) {
    console.error(error.stack);
  }
  process.exit(1);
}

