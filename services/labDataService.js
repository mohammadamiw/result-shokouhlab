import axios from 'axios';
import dotenv from 'dotenv';
import { dataTransformer } from '../utils/dataTransformer.js';

dotenv.config();

/**
 * سرویس دریافت داده‌های آزمایشگاه از سیستم پارسی‌پل
 * 
 * استراتژی ترکیبی:
 * - پورت 8085 (SOAP): برای دریافت لیست پذیرش‌ها (Web_GetAdmitList)
 * - پورت 8090 (REST): برای دریافت نتایج آزمایش (detailMonitoring)
 */
export const labDataService = {
  
  // آدرس‌های پایه
  SOAP_URL: 'http://80.210.56.217:8085',   // پورت 8085 - SOAP قدیمی
  REST_URL: 'http://80.210.56.217:8090',   // پورت 8090 - REST مدرن
  
  /**
   * مرحله ۱: دریافت لیست پذیرش‌ها از پورت 8085 (SOAP)
   * آدرس: Service1.asmx/Web_GetAdmitList
   * 
   * استراتژی: چند روش مختلف را امتحان می‌کنیم تا یکی جواب دهد
   * 
   * @param {string} token - توکن Bearer
   * @param {string} nationalId - کد ملی کاربر
   * @param {string} password - پسورد کاربر
   * @returns {Promise<Array>} - لیست پذیرش‌ها
   */
  async getAdmitList(token, nationalId, password) {
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║  📋 مرحله ۱: دریافت لیست پذیرش‌ها (پورت 8085 - SOAP)          ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝');

    // اعتبارسنجی
    if (!nationalId) {
      throw new Error('کد ملی الزامی است');
    }
    if (!password) {
      throw new Error('رمز عبور الزامی است');
    }

    // لیست روش‌های مختلف برای تست
    const attempts = [
      {
        name: 'POST با x-www-form-urlencoded',
        method: 'POST',
        endpoint: `${this.SOAP_URL}//Service1.asmx/Web_GetAdmitList`,  // دقت: دو اسلش
        contentType: 'application/x-www-form-urlencoded',
        useFormData: true
      },
      {
        name: 'GET با Query String',
        method: 'GET',
        endpoint: `${this.SOAP_URL}//Service1.asmx/Web_GetAdmitList`,
        contentType: null,
        useFormData: false
      },
      {
        name: 'POST JSON',
        method: 'POST',
        endpoint: `${this.SOAP_URL}/Service1.asmx/Web_GetAdmitList`,
        contentType: 'application/json',
        useFormData: false
      },
      {
        name: 'GET با یک اسلش',
        method: 'GET',
        endpoint: `${this.SOAP_URL}/Service1.asmx/Web_GetAdmitList`,
        contentType: null,
        useFormData: false
      }
    ];

    // پارامترها
    const params = {
      UserName: process.env.LAB_SYSTEM_USERNAME || 'AngularWeb',
      Password: process.env.LAB_ENCRYPTED_PASSWORD,
      _ID: nationalId,
      _Pass: password
    };

    console.log('');
    console.log('🔐 پارامترها:');
    console.log(`   ├── UserName: ${params.UserName}`);
    console.log(`   ├── Password: ${params.Password ? '***' : '❌ خالی!'}`);
    console.log(`   ├── _ID: ${nationalId}`);
    console.log(`   └── _Pass: ***`);

    let lastError = null;

    for (const attempt of attempts) {
      console.log('');
      console.log(`🔄 تلاش: ${attempt.name}`);
      console.log(`   ├── Method: ${attempt.method}`);
      console.log(`   └── URL: ${attempt.endpoint}`);

      try {
        let response;

        if (attempt.method === 'POST') {
          if (attempt.useFormData) {
            // ارسال به صورت form-urlencoded
            const formParams = new URLSearchParams();
            formParams.append('UserName', params.UserName);
            formParams.append('Password', params.Password);
            formParams.append('_ID', params._ID);
            formParams.append('_Pass', params._Pass);

            response = await axios.post(attempt.endpoint, formParams.toString(), {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
              },
              timeout: 60000
            });
          } else {
            // ارسال به صورت JSON
            response = await axios.post(attempt.endpoint, params, {
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              timeout: 60000
            });
          }
        } else {
          // GET با Query String
          response = await axios.get(attempt.endpoint, {
            params: params,
            headers: {
              'Accept': 'application/json'
            },
            timeout: 60000
          });
        }

        console.log(`   ✅ موفق! Status: ${response.status}`);

        // پردازش پاسخ
        let admitList = response.data;
        
        // اگر string است، parse کنیم
        if (typeof admitList === 'string') {
          admitList = dataTransformer.fixEncoding(admitList);
          try {
            admitList = JSON.parse(admitList);
          } catch (e) {
            console.error('   ⚠️ خطا در parse:', e.message);
            continue;
          }
        }

        // تبدیل به آرایه
        if (!Array.isArray(admitList)) {
          admitList = [admitList];
        }

        // بررسی لیست خالی
        if (admitList.length === 0) {
          console.log('   ⚠️ لیست خالی است');
          throw new Error('هنوز هیچ آزمایش ثبت‌شده‌ای برای شما وجود ندارد.');
        }

        console.log(`   📊 تعداد پذیرش‌ها: ${admitList.length}`);

        // نمایش اولین آیتم
        if (admitList.length > 0) {
          const first = admitList[0];
          console.log('');
          console.log('📄 آخرین پذیرش:');
          console.log('   ├── کلیدها:', Object.keys(first).slice(0, 8).join(', '));
          console.log('   ├── PRK_PatientInfo:', first.PRK_PatientInfo || 'N/A');
          console.log('   ├── PRK_AdmitPatient:', first.PRK_AdmitPatient || 'N/A');
          console.log('   └── DBId:', first.DBId || first.dbId || 'N/A');
        }

        return admitList;

      } catch (error) {
        const status = error.response?.status || 'N/A';
        const data = error.response?.data ? JSON.stringify(error.response.data).substring(0, 100) : '';
        console.log(`   ❌ خطا: ${error.message} | Status: ${status}`);
        if (data) console.log(`      Data: ${data}`);
        lastError = error;
      }
    }

    // اگر هیچکدام جواب ندادند
    console.log('');
    console.log('❌ تمام روش‌ها شکست خوردند');
    
    if (lastError?.response?.status === 404) {
      throw new Error('هنوز هیچ آزمایش ثبت‌شده‌ای برای شما وجود ندارد.');
    }
    if (lastError?.response?.status === 401) {
      throw new Error('اطلاعات ورود نامعتبر است');
    }
    
    throw new Error('خطا در ارتباط با سرور آزمایشگاه - لطفاً بعداً تلاش کنید');
  },

  /**
   * مرحله ۲: استخراج پارامترهای داینامیک از لیست پذیرش
   */
  extractDynamicParams(admitList) {
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║  🔧 مرحله ۲: استخراج پارامترهای داینامیک                      ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝');

    if (!admitList || !Array.isArray(admitList) || admitList.length === 0) {
      throw new Error('هنوز هیچ آزمایش ثبت‌شده‌ای برای شما وجود ندارد.');
    }

    // اولین آیتم = آخرین پذیرش
    const latestAdmit = admitList[0];

    console.log('');
    console.log('📄 کلیدهای موجود در آیتم:', Object.keys(latestAdmit).join(', '));

    // استخراج با در نظر گرفتن casing مختلف
    const patientInfo = latestAdmit.PRK_PatientInfo || latestAdmit.prk_PatientInfo || 
                        latestAdmit.Prk_PatientInfo || latestAdmit.patientInfo ||
                        latestAdmit.PatientInfo;
    
    const sajaAdmitId = latestAdmit.PRK_AdmitPatient || latestAdmit.prk_AdmitPatient || 
                        latestAdmit.Prk_AdmitPatient || latestAdmit.admitPatient ||
                        latestAdmit.SajaAdmitId || latestAdmit.sajaAdmitId ||
                        latestAdmit.AdmitPatient || latestAdmit.DisplayID;
    
    const dbId = latestAdmit.DBId || latestAdmit.dbId || latestAdmit.DbId || 
                 latestAdmit.DBID || latestAdmit.Dbid || 5;

    console.log('');
    console.log('🔍 پارامترهای استخراج شده:');
    console.log('   ├── patientInfo (PRK_PatientInfo):', patientInfo !== undefined ? `✅ ${patientInfo}` : '❌ یافت نشد');
    console.log('   ├── sajaAdmitId (PRK_AdmitPatient):', sajaAdmitId !== undefined ? `✅ ${sajaAdmitId}` : '❌ یافت نشد');
    console.log('   └── dbId (DBId):', dbId !== undefined ? `✅ ${dbId}` : '❌ یافت نشد');

    if (patientInfo === undefined || patientInfo === null) {
      throw new Error('شناسه بیمار (PRK_PatientInfo) در اطلاعات پذیرش یافت نشد');
    }

    if (sajaAdmitId === undefined || sajaAdmitId === null) {
      throw new Error('شناسه پذیرش (PRK_AdmitPatient) در اطلاعات پذیرش یافت نشد');
    }

    return { patientInfo, sajaAdmitId, dbId };
  },

  /**
   * مرحله ۳: دریافت نتایج آزمایش از پورت 8090 (REST)
   * آدرس: /api/v1/shared/patientInfo/detail/detailMonitoring
   */
  async getTestResults(token, sajaAdmitId, patientInfoId, dbId) {
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║  📋 مرحله ۳: دریافت نتایج آزمایش (پورت 8090 - REST)           ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝');

    if (!token) {
      throw new Error('توکن Bearer الزامی است');
    }

    const endpoint = `${this.REST_URL}/api/v1/shared/patientInfo/detail/detailMonitoring`;
    
    const queryParams = {
      loginMode: 0,
      loginId: 0,
      dbId: dbId || 5,
      patientInfo: patientInfoId,
      sajaAdmitId: sajaAdmitId,
      pajaAdmitId: 0
    };

    console.log('');
    console.log('🌐 DEBUG - درخواست HTTP:');
    console.log('   ├── Method: GET');
    console.log('   ├── Endpoint:', endpoint);
    console.log('   ├── Port: 8090 (REST)');
    console.log('   └── Query Params:');
    Object.entries(queryParams).forEach(([key, value], index, arr) => {
      const prefix = index === arr.length - 1 ? '       └──' : '       ├──';
      console.log(`${prefix} ${key}: ${value}`);
    });
    console.log('');

    try {
      console.log('⏳ در حال ارسال درخواست به پورت 8090...');
      
      const response = await axios.get(endpoint, {
        params: queryParams,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        timeout: 60000
      });

      console.log('');
      console.log('✅ پاسخ از پورت 8090 دریافت شد!');
      console.log('   ├── Status:', response.status);
      console.log('   └── Data Type:', typeof response.data);

      if (!response.data) {
        throw new Error('پاسخ سرور خالی است');
      }

      let result = response.data;
      if (!Array.isArray(result)) {
        result = [result];
      }

      console.log(`   📊 تعداد آیتم‌ها: ${result.length}`);

      return result;

    } catch (error) {
      console.log('');
      console.log('❌ خطا در دریافت نتایج آزمایش از پورت 8090');
      console.log('   ├── Error:', error.message);
      
      if (error.response) {
        console.log('   ├── Status:', error.response.status);
        console.log('   └── Data:', JSON.stringify(error.response.data).substring(0, 200));
        
        if (error.response.status === 401) {
          throw new Error('توکن منقضی شده است - لطفاً دوباره وارد شوید');
        }
        if (error.response.status === 404) {
          throw new Error('نتایج آزمایش یافت نشد');
        }
      }
      
      throw error;
    }
  },

  /**
   * استخراج پارامترها از یک پذیرش
   */
  extractParamsFromAdmit(admit) {
    const patientInfo = admit.PRK_PatientInfo || admit.prk_PatientInfo || 
                        admit.Prk_PatientInfo || admit.patientInfo ||
                        admit.PatientInfo;
    
    const sajaAdmitId = admit.SajaAdmitPatient || admit.sajaAdmitPatient ||
                        admit.PRK_AdmitPatient || admit.prk_AdmitPatient || 
                        admit.Prk_AdmitPatient || admit.admitPatient ||
                        admit.SajaAdmitId || admit.sajaAdmitId ||
                        admit.AdmitPatient || admit.DisplayID;
    
    const dbId = admit.DBId || admit.dbId || admit.DbId || 
                 admit.DBID || admit.Dbid || 5;

    // تاریخ پذیرش - فیلد اصلی: Str_AdmitDate (تاریخ شمسی)
    const dateField = admit.Str_AdmitDate || admit.str_AdmitDate ||
                      admit.AdmitDate || admit.admitDate || admit.Date || 
                      admit.CreateDate || admit.RegistrationDate ||
                      admit.DateAdmit || admit.dateAdmit || null;

    // شماره نمایشی (شماره پذیرش)
    const displayId = admit.DisplayID || admit.displayId || admit.DisplayId || 
                      admit.PRK_AdmitPatient || sajaAdmitId;

    // نام بیمار - فیلدهای اصلی: Str_FName + Str_LName
    let patientName = null;
    if (admit.Str_FName || admit.Str_LName) {
      const firstName = admit.Str_FName || admit.str_FName || '';
      const lastName = admit.Str_LName || admit.str_LName || '';
      patientName = `${firstName} ${lastName}`.trim();
    } else {
      patientName = admit.PatientName || admit.patientName || admit.FullName || 
                    admit.fullName || admit.Name || admit.name ||
                    admit.PatientFullName || admit.patientFullName || null;
    }

    return { patientInfo, sajaAdmitId, dbId, dateField, displayId, patientName };
  },

  /**
   * متد اصلی: دریافت تمام آزمایش‌های کاربر
   * 
   * فلو:
   * 1. پورت 8085 → لیست تمام پذیرش‌ها
   * 2. برای هر پذیرش → دریافت نتایج از پورت 8090
   * 3. گروه‌بندی بر اساس تاریخ
   */
  async getPatientTestsChained(token, nationalId, password) {
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║     🔗 شروع فرآیند زنجیره‌ای (تمام آزمایش‌ها)                  ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('🔐 پارامترهای ورودی:');
    console.log('   ├── nationalId:', nationalId);
    console.log('   ├── password:', password ? `${password.substring(0, 3)}***` : '❌ خالی');
    console.log('   └── token:', token ? '✓ موجود' : '❌ خالی');
    console.log('');

    try {
      // مرحله ۱: دریافت لیست تمام پذیرش‌ها از پورت 8085
      const admitList = await this.getAdmitList(token, nationalId, password);

      console.log('');
      console.log('╔═══════════════════════════════════════════════════════════════╗');
      console.log(`║  📋 پردازش ${admitList.length} پذیرش                                         ║`);
      console.log('╚═══════════════════════════════════════════════════════════════╝');

      // مرحله ۲: برای هر پذیرش، نتایج را دریافت کن
      const allAdmissions = [];
      let patientName = null; // نام بیمار از اولین پذیرش استخراج می‌شود
      
      // 🔍 DEBUG: نمایش تمام فیلدهای موجود در اولین پذیرش
      if (admitList.length > 0) {
        console.log('');
        console.log('╔═══════════════════════════════════════════════════════════════╗');
        console.log('║  🔍 DEBUG: ساختار داده پذیرش                                   ║');
        console.log('╚═══════════════════════════════════════════════════════════════╝');
        console.log('');
        console.log('📄 تمام فیلدهای موجود در اولین پذیرش:');
        const firstAdmit = admitList[0];
        Object.keys(firstAdmit).forEach((key, index, arr) => {
          const value = firstAdmit[key];
          const prefix = index === arr.length - 1 ? '└──' : '├──';
          const displayValue = typeof value === 'string' ? value.substring(0, 50) : value;
          console.log(`   ${prefix} ${key}: ${displayValue}`);
        });
        console.log('');
      }
      
      for (let i = 0; i < admitList.length; i++) {
        const admit = admitList[i];
        const extracted = this.extractParamsFromAdmit(admit);
        const { patientInfo, sajaAdmitId, dbId, dateField, displayId } = extracted;

        // ذخیره نام بیمار از اولین پذیرش
        if (!patientName && extracted.patientName) {
          patientName = extracted.patientName;
        }

        console.log('');
        console.log(`📋 پذیرش ${i + 1}/${admitList.length}:`);
        console.log(`   ├── شماره پذیرش: ${displayId}`);
        console.log(`   ├── نام بیمار: ${extracted.patientName || 'نامشخص'}`);
        console.log(`   ├── patientInfo: ${patientInfo}`);
        console.log(`   ├── sajaAdmitId: ${sajaAdmitId}`);
        console.log(`   └── تاریخ: ${dateField || 'نامشخص'}`);

        if (!patientInfo || !sajaAdmitId) {
          console.log(`   ⚠️ پارامترهای ناقص - رد شد`);
          continue;
        }

        try {
          // دریافت نتایج این پذیرش
          const rawResults = await this.getTestResults(token, sajaAdmitId, patientInfo, dbId);
          const formattedResults = this.formatFinalData(rawResults);

          // تاریخ - اگر Str_AdmitDate باشه از قبل شمسیه، نیازی به تبدیل نیست
          let jalaliDate = dateField || 'نامشخص';
          // اگر میلادی بود تبدیل کن
          if (dateField && dateField.includes('-')) {
            jalaliDate = dataTransformer.convertToJalali(dateField);
          }

          // تعیین وضعیت کلی پذیرش
          const hasPending = formattedResults.some(t => t.isPending);
          const status = hasPending ? 'در حال انجام' : 'تکمیل شده';

          allAdmissions.push({
            id: displayId,
            admitNumber: displayId, // شماره پذیرش
            admitId: sajaAdmitId,
            date: jalaliDate,
            dateRaw: dateField,
            status: status,
            testCount: formattedResults.length,
            tests: formattedResults
          });

          console.log(`   ✅ ${formattedResults.length} آزمایش دریافت شد (${status})`);

        } catch (err) {
          console.log(`   ⚠️ خطا در دریافت نتایج: ${err.message}`);
          // ادامه به پذیرش بعدی
        }
      }

      console.log('');
      console.log('╔═══════════════════════════════════════════════════════════════╗');
      console.log(`║  ✅ ${allAdmissions.length} پذیرش با موفقیت پردازش شد                        ║`);
      console.log('╚═══════════════════════════════════════════════════════════════╝');
      console.log('');

      // محاسبه آمار کلی
      const totalTests = allAdmissions.reduce((sum, a) => sum + a.testCount, 0);
      const pendingCount = allAdmissions.filter(a => a.status === 'در حال انجام').length;
      const completedCount = allAdmissions.filter(a => a.status === 'تکمیل شده').length;

      console.log(`   👤 نام بیمار: ${patientName || 'نامشخص'}`);

      return {
        summary: {
          totalAdmissions: allAdmissions.length,
          totalTests: totalTests,
          pendingCount: pendingCount,
          completedCount: completedCount,
          patientName: patientName || null
        },
        admissions: allAdmissions
      };

    } catch (error) {
      console.log('');
      console.log('╔═══════════════════════════════════════════════════════════════╗');
      console.log('║  ❌ خطا در فرآیند زنجیره‌ای                                   ║');
      console.log('╚═══════════════════════════════════════════════════════════════╝');
      console.log('   Error:', error.message);
      console.log('');
      
      throw error;
    }
  },

  /**
   * فرمت کردن داده‌های خام
   */
  formatFinalData(rawData) {
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║  🔧 مرحله ۴: فرمت‌کردن نتایج آزمایش                           ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝');

    if (!rawData) {
      console.log('⚠️ داده ورودی null است');
      return [];
    }

    let dataArray = Array.isArray(rawData) ? rawData : [rawData];

    if (dataArray.length === 0) {
      console.log('⚠️ آرایه خالی است');
      return [];
    }

    const allTests = [];

    // عبارت‌هایی که نشان می‌دهند جواب آماده نیست
    const pendingPhrases = [
      'جواب آزمایش آماده نمی باشد',
      'جواب آزمایش آماده نمیباشد',
      'آماده نمی باشد',
      'در حال انجام',
      'pending'
    ];

    dataArray.forEach((item, index) => {
      if (!item || !item.json) {
        if (item && item.detailMonitoring) {
          this._processDetailMonitoring(item.detailMonitoring, allTests, index, pendingPhrases);
        }
        return;
      }

      try {
        let jsonString = item.json;
        
        if (typeof jsonString === 'string') {
          jsonString = dataTransformer.fixEncoding(jsonString);
          const parsedJson = JSON.parse(jsonString);
          this._processDetailMonitoring(parsedJson.detailMonitoring, allTests, index, pendingPhrases);
        } else if (typeof jsonString === 'object') {
          this._processDetailMonitoring(jsonString.detailMonitoring, allTests, index, pendingPhrases);
        }
      } catch (parseError) {
        console.error(`   ❌ خطا در parse کردن JSON:`, parseError.message);
      }
    });

    console.log(`   ✅ ${allTests.length} نتیجه آزمایش فرمت شد`);

    return allTests;
  },

  /**
   * پردازش آرایه detailMonitoring
   * @private
   */
  _processDetailMonitoring(detailMonitoring, allTests, itemIndex, pendingPhrases) {
    if (!detailMonitoring || !Array.isArray(detailMonitoring)) {
      return;
    }

    detailMonitoring.forEach((test, testIndex) => {
      const testName = test.TestSpecialName || test.TestGeneralName || 
                       test.testSpecialName || test.testGeneralName || 'نامشخص';
      
      let result = test.TestResult || test.testResult || test.Result || '—';
      const normalRange = test.NormalRange || test.normalRange || '';
      const unit = test.Unit || test.unit || '';

      // بررسی اینکه آیا جواب آماده نیست
      const resultStr = String(result).trim().toLowerCase();
      const isPending = pendingPhrases.some(phrase => 
        resultStr.includes(phrase.toLowerCase())
      );

      if (isPending) {
        result = 'در حال بررسی...';
      }

      allTests.push({
        id: test.id || test.TestId || `test-${itemIndex}-${testIndex}`,
        testName: testName,
        result: String(result),
        normalRange: normalRange,
        unit: unit,
        isPending: isPending
      });
    });
  },

  /**
   * دریافت جزئیات یک آزمایش خاص
   */
  async getTestDetails(token, nationalId, testId) {
    console.warn('⚠️ متد getTestDetails هنوز پیاده‌سازی نشده');
    return null;
  }
};
