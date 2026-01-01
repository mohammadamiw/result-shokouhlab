import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * سرویس احراز هویت با سیستم آزمایشگاه
 * این سرویس به صورت مخفیانه با سیستم Parsipal ارتباط برقرار می‌کند
 * آدرس واقعی: http://80.210.56.217:8090/api/v1/auth/auth
 */
export const labAuthService = {
  /**
   * دریافت توکن از سیستم آزمایشگاه
   * @param {string} nationalId - کد ملی بیمار
   * @param {string} password - رمز عبور بیمار (یا انکریپت شده)
   * @returns {Promise<string|null>} - توکن احراز هویت یا null در صورت خطا
   */
  async getToken(nationalId, password) {
    try {
      // آدرس از تنظیمات یا fallback به آدرس پیش‌فرض
      const authURL = process.env.LAB_AUTH_URL || 'http://80.210.56.217:8090/api/v1/auth/auth';
      
      // پسورد انکریپت شده از تنظیمات (اگر نیاز باشد)
      const encryptedPassword = process.env.LAB_ENCRYPTED_PASSWORD;
      
      // اگر پسورد انکریپت شده در تنظیمات باشد، از آن استفاده می‌کنیم
      // در غیر این صورت از پسورد خام استفاده می‌کنیم
      const passwordToSend = encryptedPassword || password;

      // userName از تنظیمات یا مقدار پیش‌فرض
      const userName = process.env.LAB_SYSTEM_USERNAME || 'AngularWeb';

      console.log('Attempting authentication for nationalId:', nationalId);
      console.log('Using auth URL:', authURL);
      console.log('Using userName:', userName);
      
      // درخواست به سیستم آزمایشگاه برای دریافت توکن
      const response = await axios.post(
        authURL,
        {
          userName: userName,
          nationalId: nationalId,
          password: passwordToSend
          // ممکن است سیستم آزمایشگاه فیلدهای دیگری نیاز داشته باشد
          // code, etc.
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Lab-Middleware-API/1.0'
          },
          timeout: 15000, // 15 seconds timeout
          // اگر سیستم آزمایشگاه از SSL خودامضا استفاده می‌کند
          // httpsAgent: new https.Agent({ rejectUnauthorized: false })
        }
      );

      console.log('Auth response status:', response.status);
      console.log('Auth response data:', JSON.stringify(response.data).substring(0, 200));

      // استخراج توکن از پاسخ
      // بسته به فرمت پاسخ سیستم آزمایشگاه، این بخش باید تنظیم شود
      if (response.data) {
        // حالت 1: توکن مستقیم در data
        if (response.data.token) {
          return response.data.token;
        }
        // حالت 2: accessToken
        if (response.data.accessToken) {
          return response.data.accessToken;
        }
        // حالت 3: data.token
        if (response.data.data && response.data.data.token) {
          return response.data.data.token;
        }
        // حالت 4: response.data یک string است
        if (typeof response.data === 'string') {
          return response.data;
        }
        // حالت 5: response.data.result.token
        if (response.data.result && response.data.result.token) {
          return response.data.result.token;
        }
        // حالت 6: ممکن است کل response.data توکن باشد
        if (response.data && Object.keys(response.data).length === 1) {
          const firstKey = Object.keys(response.data)[0];
          if (typeof response.data[firstKey] === 'string' && response.data[firstKey].length > 20) {
            return response.data[firstKey];
          }
        }
      }

      console.warn('Token not found in response. Full response:', JSON.stringify(response.data));
      return null;
    } catch (error) {
      console.error('Lab authentication error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      
      // اگر سیستم آزمایشگاه خطای خاصی می‌دهد، آن را مدیریت می‌کنیم
      if (error.response?.status === 401) {
        throw new Error('کد ملی یا رمز عبور اشتباه است');
      } else if (error.response?.status === 403) {
        throw new Error('دسترسی به سیستم آزمایشگاه محدود است');
      } else if (error.response?.status === 404) {
        throw new Error('آدرس احراز هویت یافت نشد');
      } else if (error.code === 'ECONNREFUSED') {
        throw new Error('ارتباط با سیستم آزمایشگاه برقرار نشد - سرور در دسترس نیست');
      } else if (error.code === 'ETIMEDOUT') {
        throw new Error('زمان انتظار برای احراز هویت به پایان رسید');
      } else if (error.response?.data) {
        // اگر سیستم آزمایشگاه پیام خطای خاصی می‌دهد
        const errorMessage = error.response.data.message || error.response.data.error || error.response.data;
        throw new Error(`خطا از سیستم آزمایشگاه: ${errorMessage}`);
      }
      
      throw error;
    }
  },

  /**
   * اعتبارسنجی توکن
   * @param {string} token - توکن برای بررسی
   * @returns {Promise<boolean>}
   */
  async validateToken(token) {
    try {
      const baseURL = process.env.LAB_API_BASE_URL;
      const validateEndpoint = process.env.LAB_API_VALIDATE_ENDPOINT || '/api/validate-token';

      const response = await axios.post(
        `${baseURL}${validateEndpoint}`,
        { token },
        { timeout: 5000 }
      );

      return response.data?.valid === true || response.data?.isValid === true;
    } catch (error) {
      console.error('Token validation error:', error.message);
      return false;
    }
  },

  /**
   * تست اتصال و دریافت توکن با استفاده از تنظیمات .env
   * این متد برای تست اولیه اتصال استفاده می‌شود
   * @param {string} nationalId - کد ملی برای تست (اختیاری، اگر نباشد از env استفاده می‌شود)
   * @returns {Promise<{success: boolean, token: string|null, message: string}>}
   */
  async testConnection(nationalId = null) {
    try {
      const authURL = process.env.LAB_AUTH_URL;
      const encryptedPassword = process.env.LAB_ENCRYPTED_PASSWORD;

      // بررسی اینکه تنظیمات لازم وجود دارد
      if (!authURL) {
        return {
          success: false,
          token: null,
          message: '❌ خطا: LAB_AUTH_URL در فایل .env تنظیم نشده است'
        };
      }

      if (!encryptedPassword) {
        return {
          success: false,
          token: null,
          message: '❌ خطا: LAB_ENCRYPTED_PASSWORD در فایل .env تنظیم نشده است'
        };
      }

      // اگر nationalId داده نشده، از env استفاده می‌کنیم یا یک مقدار تست
      const testNationalId = nationalId || process.env.TEST_NATIONAL_ID || '0000000000';

      // userName از تنظیمات یا مقدار پیش‌فرض
      const userName = process.env.LAB_SYSTEM_USERNAME || 'AngularWeb';

      console.log('\n🔍 در حال تست اتصال به سیستم آزمایشگاه...');
      console.log('📍 آدرس:', authURL);
      console.log('👤 User Name:', userName);
      console.log('🆔 کد ملی تست:', testNationalId);
      console.log('🔐 استفاده از پسورد انکریپت شده: ✓\n');

      // درخواست به سیستم آزمایشگاه
      const response = await axios.post(
        authURL,
        {
          userName: userName,
          nationalId: testNationalId,
          password: encryptedPassword
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Lab-Middleware-API/1.0'
          },
          timeout: 15000
        }
      );

      console.log('✅ پاسخ دریافت شد!');
      console.log('📊 Status Code:', response.status);
      console.log('📦 Response Data:', JSON.stringify(response.data, null, 2));

      // استخراج توکن
      let token = null;
      if (response.data) {
        if (response.data.token) {
          token = response.data.token;
        } else if (response.data.accessToken) {
          token = response.data.accessToken;
        } else if (response.data.data && response.data.data.token) {
          token = response.data.data.token;
        } else if (typeof response.data === 'string') {
          token = response.data;
        } else if (response.data.result && response.data.result.token) {
          token = response.data.result.token;
        }
      }

      if (token) {
        return {
          success: true,
          token: token,
          message: `✅ موفق! توکن دریافت شد: ${token.substring(0, 50)}...`
        };
      } else {
        return {
          success: false,
          token: null,
          message: '⚠️ پاسخ دریافت شد اما توکن یافت نشد. پاسخ کامل:\n' + JSON.stringify(response.data, null, 2)
        };
      }
    } catch (error) {
      console.error('❌ خطا در تست اتصال:', error.message);
      
      let errorMessage = '❌ خطا در اتصال به سیستم آزمایشگاه:\n';
      
      if (error.code === 'ECONNREFUSED') {
        errorMessage += '🔴 سرور در دسترس نیست یا آدرس اشتباه است';
      } else if (error.code === 'ETIMEDOUT') {
        errorMessage += '⏱️ زمان انتظار به پایان رسید';
      } else if (error.response) {
        errorMessage += `📊 Status: ${error.response.status}\n`;
        errorMessage += `📦 Response: ${JSON.stringify(error.response.data, null, 2)}`;
      } else {
        errorMessage += error.message;
      }

      return {
        success: false,
        token: null,
        message: errorMessage
      };
    }
  }
};

