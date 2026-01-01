import dotenv from 'dotenv';
import { labAuthService } from './services/labAuthService.js';
import { labDataService } from './services/labDataService.js';

// بارگذاری تنظیمات از .env
dotenv.config();

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║     تست دریافت داده از سیستم آزمایشگاه                ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

// بررسی تنظیمات
console.log('🔍 بررسی تنظیمات...\n');

const authURL = process.env.LAB_AUTH_URL;
const encryptedPassword = process.env.LAB_ENCRYPTED_PASSWORD;
const testNationalId = process.env.TEST_NATIONAL_ID;
const testPatientPassword = process.env.TEST_PATIENT_PASSWORD;

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
  console.log('\n💡 راهنما:');
  console.log('   فایل .env را ویرایش کنید و این خط را اضافه کنید:');
  console.log('   TEST_NATIONAL_ID=1234567890\n');
  process.exit(1);
}

if (!testPatientPassword) {
  console.error('❌ خطا: TEST_PATIENT_PASSWORD در فایل .env تنظیم نشده است');
  console.log('\n💡 راهنما:');
  console.log('   فایل .env را ویرایش کنید و این خط را اضافه کنید:');
  console.log('   TEST_PATIENT_PASSWORD=patient_password_here\n');
  process.exit(1);
}

console.log('✅ تنظیمات پیدا شد:');
console.log(`   📍 آدرس Auth: ${authURL}`);
console.log(`   🆔 کد ملی تست: ${testNationalId}`);
console.log(`   🔐 پسورد سیستم: ${encryptedPassword.substring(0, 10)}... (مخفی)`);
console.log(`   🔑 پسورد بیمار: ${testPatientPassword.substring(0, 5)}... (مخفی)\n`);

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

// مرحله 2: دریافت داده‌های آزمایش
console.log('📊 مرحله 2: دریافت لیست آزمایش‌های بیمار...\n');

try {
  const tests = await labDataService.getPatientTests(
    token,
    testNationalId,
    testPatientPassword
  );
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('✅ داده‌ها با موفقیت دریافت شدند!\n');
  
  console.log('📋 خلاصه:');
  console.log(`   تعداد آزمایش‌ها: ${tests.length}`);
  console.log(`   نوع داده: ${Array.isArray(tests) ? 'Array' : typeof tests}\n`);
  
  if (tests.length === 0) {
    console.log('⚠️ هیچ آزمایشی یافت نشد.');
    process.exit(0);
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📦 ساختار کامل داده‌ها:\n');
  console.log(JSON.stringify(tests, null, 2));
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('🔍 بررسی فارسی‌ها و encoding:\n');
  
  // بررسی اولین آزمایش برای دیدن ساختار
  if (tests.length > 0) {
    const firstTest = tests[0];
    console.log('📄 اولین آزمایش:');
    console.log(JSON.stringify(firstTest, null, 2));
    
    console.log('\n🔤 بررسی فیلدهای متنی برای فارسی:');
    
    // بررسی فیلدهای متنی برای کاراکترهای فارسی
    const checkPersian = (obj, prefix = '') => {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string' && value.length > 0) {
          const hasPersian = /[\u0600-\u06FF]/.test(value);
          const preview = value.length > 50 ? value.substring(0, 50) + '...' : value;
          console.log(`   ${prefix}${key}: ${hasPersian ? '✅ فارسی' : '❌ بدون فارسی'} - "${preview}"`);
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          checkPersian(value, `${prefix}${key}.`);
        }
      }
    };
    
    checkPersian(firstTest);
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('✅ تست با موفقیت انجام شد!\n');
  
} catch (error) {
  console.error('\n❌ خطا در دریافت داده‌ها:', error.message);
  console.error('\n📋 جزئیات خطا:');
  if (error.stack) {
    console.error(error.stack);
  }
  process.exit(1);
}

