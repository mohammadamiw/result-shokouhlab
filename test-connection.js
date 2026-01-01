import dotenv from 'dotenv';
import { labAuthService } from './services/labAuthService.js';

// بارگذاری تنظیمات از .env
dotenv.config();

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║     تست اتصال به سیستم آزمایشگاه - Parsipal Lab        ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

// بررسی تنظیمات
console.log('🔍 بررسی تنظیمات...\n');

const authURL = process.env.LAB_AUTH_URL;
const encryptedPassword = process.env.LAB_ENCRYPTED_PASSWORD;
const userName = process.env.LAB_SYSTEM_USERNAME || 'AngularWeb';

if (!authURL) {
  console.error('❌ خطا: LAB_AUTH_URL در فایل .env تنظیم نشده است');
  console.log('\n💡 راهنما:');
  console.log('   فایل .env را بسازید و این خط را اضافه کنید:');
  console.log('   LAB_AUTH_URL=http://80.210.56.217:8090/api/v1/auth/auth\n');
  process.exit(1);
}

if (!encryptedPassword) {
  console.error('❌ خطا: LAB_ENCRYPTED_PASSWORD در فایل .env تنظیم نشده است');
  console.log('\n💡 راهنما:');
  console.log('   فایل .env را بسازید و این خط را اضافه کنید:');
  console.log('   LAB_ENCRYPTED_PASSWORD=your_encrypted_password_here\n');
  process.exit(1);
}

console.log('✅ تنظیمات پیدا شد:');
console.log(`   📍 آدرس: ${authURL}`);
console.log(`   👤 User Name: ${userName}`);
console.log(`   🔐 پسورد: ${encryptedPassword.substring(0, 10)}... (مخفی)\n`);

// تست اتصال
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

labAuthService.testConnection()
  .then(result => {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📋 نتیجه تست:\n');
    console.log(result.message);
    
    if (result.success) {
      console.log('\n✅ اتصال موفقیت‌آمیز بود! سیستم آماده استفاده است.');
      console.log(`\n🔑 توکن دریافت شده (اولین 50 کاراکتر): ${result.token.substring(0, 50)}...`);
      process.exit(0);
    } else {
      console.log('\n❌ اتصال ناموفق بود. لطفاً تنظیمات را بررسی کنید.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n❌ خطای غیرمنتظره:', error);
    process.exit(1);
  });

