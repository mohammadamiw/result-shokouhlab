/**
 * تست برای دیدن فیلدهای موجود در لیست پذیرش
 */
import dotenv from 'dotenv';
import { labAuthService } from './services/labAuthService.js';
import axios from 'axios';
import { dataTransformer } from './utils/dataTransformer.js';

dotenv.config();

const SOAP_URL = 'http://80.210.56.217:8085';

async function testGetAdmitListFields() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  تست دیدن فیلدهای واقعی لیست پذیرش');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // تست با کد ملی کاربر
  const nationalId = '2580176136';
  const password = '09376599498';

  if (!nationalId || !password) {
    console.log('❌ لطفاً TEST_NATIONAL_ID و TEST_PATIENT_PASSWORD را در .env تنظیم کنید');
    return;
  }

  try {
    // گرفتن توکن
    console.log('1️⃣ گرفتن توکن...');
    const token = await labAuthService.getToken(nationalId, password);
    console.log('   ✅ توکن دریافت شد');

    // گرفتن لیست پذیرش
    console.log('');
    console.log('2️⃣ گرفتن لیست پذیرش از پورت 8085...');
    
    const endpoint = `${SOAP_URL}//Service1.asmx/Web_GetAdmitList`;
    const params = {
      UserName: process.env.LAB_SYSTEM_USERNAME || 'AngularWeb',
      Password: process.env.LAB_ENCRYPTED_PASSWORD,
      _ID: nationalId,
      _Pass: password
    };

    // تلاش با POST و x-www-form-urlencoded
    const formData = new URLSearchParams(params).toString();
    const response = await axios.post(endpoint, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: 60000, // افزایش timeout به 60 ثانیه
      responseType: 'text'
    });

    // پردازش پاسخ
    let data = response.data;
    if (typeof data === 'string') {
      data = dataTransformer.fixEncoding(data);
      data = JSON.parse(data);
    }

    // استخراج لیست
    let admitList = data;
    if (data && data.data) admitList = data.data;
    else if (data && data.result) admitList = data.result;

    if (!Array.isArray(admitList)) {
      admitList = [admitList];
    }

    console.log(`   ✅ ${admitList.length} پذیرش دریافت شد`);
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  📋 تمام فیلدهای موجود در اولین پذیرش:');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');

    if (admitList.length > 0) {
      const firstAdmit = admitList[0];
      const keys = Object.keys(firstAdmit);
      
      console.log(`تعداد فیلدها: ${keys.length}`);
      console.log('');
      
      keys.forEach((key, index) => {
        const value = firstAdmit[key];
        const displayValue = typeof value === 'string' 
          ? (value.length > 60 ? value.substring(0, 60) + '...' : value)
          : value;
        console.log(`   ${index + 1}. ${key}: ${displayValue}`);
      });

      console.log('');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log('  🔍 جستجوی فیلدهای تاریخ و نام:');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log('');

      // جستجو برای فیلدهای احتمالی تاریخ
      const dateKeywords = ['date', 'time', 'تاریخ', 'Date', 'Time'];
      const nameKeywords = ['name', 'patient', 'نام', 'Name', 'Patient', 'Full'];
      
      const dateFields = keys.filter(k => 
        dateKeywords.some(dk => k.toLowerCase().includes(dk.toLowerCase()))
      );
      
      const nameFields = keys.filter(k => 
        nameKeywords.some(nk => k.toLowerCase().includes(nk.toLowerCase()))
      );

      console.log('فیلدهای احتمالی تاریخ:');
      if (dateFields.length > 0) {
        dateFields.forEach(f => console.log(`   ✅ ${f}: ${firstAdmit[f]}`));
      } else {
        console.log('   ❌ هیچ فیلدی یافت نشد');
      }

      console.log('');
      console.log('فیلدهای احتمالی نام:');
      if (nameFields.length > 0) {
        nameFields.forEach(f => console.log(`   ✅ ${f}: ${firstAdmit[f]}`));
      } else {
        console.log('   ❌ هیچ فیلدی یافت نشد');
      }

      console.log('');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log('  📦 خروجی کامل JSON اولین پذیرش:');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log('');
      console.log(JSON.stringify(firstAdmit, null, 2));
    }

  } catch (error) {
    console.log('');
    console.log('❌ خطا:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
  }
}

testGetAdmitListFields();

