import iconv from 'iconv-lite';
import moment from 'moment-jalaali';

/**
 * تبدیل‌کننده داده‌های خام آزمایشگاه به فرمت تمیز و استاندارد
 * این ماژول مسئول:
 * 1. تبدیل encoding (Arabic/Persian) به UTF-8
 * 2. تبدیل تاریخ میلادی به شمسی
 * 3. پاکسازی و ساختاردهی داده‌ها
 */
export const dataTransformer = {
  /**
   * تبدیل encoding از Windows-1256 یا ISO-8859-6 به UTF-8
   * مشکل: Ù…Ø­Ù…Ø¯ → محمد
   */
  fixEncoding(text) {
    if (!text || typeof text !== 'string') {
      return text;
    }

    try {
      // اگر متن از قبل UTF-8 است، آن را برمی‌گردانیم
      if (this.isValidUTF8(text)) {
        return text;
      }

      // تلاش برای تبدیل از Windows-1256 (Arabic)
      let decoded = iconv.decode(Buffer.from(text, 'binary'), 'windows-1256');
      if (this.containsPersianChars(decoded)) {
        return decoded;
      }

      // تلاش برای تبدیل از ISO-8859-6
      decoded = iconv.decode(Buffer.from(text, 'binary'), 'iso-8859-6');
      if (this.containsPersianChars(decoded)) {
        return decoded;
      }

      // تلاش برای تبدیل از CP1256
      decoded = iconv.decode(Buffer.from(text, 'binary'), 'cp1256');
      if (this.containsPersianChars(decoded)) {
        return decoded;
      }

      // اگر هیچکدام کار نکرد، متن اصلی را برمی‌گردانیم
      console.warn('Could not decode text:', text.substring(0, 50));
      return text;
    } catch (error) {
      console.error('Encoding conversion error:', error);
      return text;
    }
  },

  /**
   * بررسی اینکه آیا متن UTF-8 معتبر است
   */
  isValidUTF8(text) {
    try {
      return text === decodeURIComponent(encodeURIComponent(text));
    } catch (e) {
      return false;
    }
  },

  /**
   * بررسی اینکه آیا متن شامل کاراکترهای فارسی است
   */
  containsPersianChars(text) {
    const persianRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return persianRegex.test(text);
  },

  /**
   * تبدیل تاریخ میلادی به شمسی
   * @param {string|Date} date - تاریخ میلادی
   * @returns {Object} - { jalali: '1402/08/15', formatted: '15 آبان 1402' }
   */
  convertToJalali(date) {
    if (!date) {
      return { jalali: null, formatted: null };
    }

    try {
      const momentDate = moment(date);
      const jalali = momentDate.format('jYYYY/jMM/jDD');
      const formatted = momentDate.format('jD jMMMM jYYYY');

      return {
        jalali: jalali,
        formatted: formatted,
        timestamp: momentDate.valueOf()
      };
    } catch (error) {
      console.error('Date conversion error:', error);
      return { jalali: null, formatted: null };
    }
  },

  /**
   * تبدیل داده‌های خام آزمایش‌ها به فرمت تمیز
   * @param {Array|Buffer} rawData - داده‌های خام از سیستم آزمایشگاه
   * @returns {Array} - آرایه‌ای از آزمایش‌های تمیز
   */
  transformTests(rawData) {
    try {
      // اگر rawData یک Buffer است، ابتدا آن را به string تبدیل می‌کنیم
      let data;
      if (Buffer.isBuffer(rawData)) {
        data = this.fixEncoding(rawData.toString('binary'));
        // تلاش برای parse کردن JSON
        try {
          data = JSON.parse(data);
        } catch (e) {
          // اگر JSON نیست، ممکن است XML یا فرمت دیگری باشد
          console.warn('Data is not JSON, might be XML or other format');
          // در اینجا می‌توانید XML parser اضافه کنید
          return [];
        }
      } else {
        data = rawData;
      }

      // اگر data یک آرایه نیست، آن را تبدیل می‌کنیم
      if (!Array.isArray(data)) {
        if (data.tests && Array.isArray(data.tests)) {
          data = data.tests;
        } else if (data.data && Array.isArray(data.data)) {
          data = data.data;
        } else {
          data = [data];
        }
      }

      // تبدیل هر آزمایش
      return data.map((test, index) => {
        return {
          id: test.id || test.testId || `test-${index}`,
          testName: this.fixEncoding(test.testName || test.name || 'نامشخص'),
          patientName: this.fixEncoding(test.patientName || test.name || ''),
          nationalId: test.nationalId || test.code || '',
          testDate: this.convertToJalali(test.testDate || test.date),
          result: this.fixEncoding(test.result || test.value || ''),
          unit: this.fixEncoding(test.unit || ''),
          referenceRange: this.fixEncoding(test.referenceRange || test.normalRange || ''),
          status: test.status || this.determineStatus(test.result, test.referenceRange),
          labName: this.fixEncoding(test.labName || 'آزمایشگاه پارسی‌پل'),
          doctorName: this.fixEncoding(test.doctorName || test.doctor || ''),
          notes: this.fixEncoding(test.notes || test.comment || ''),
          rawData: test // نگه‌داری داده خام برای مرجع
        };
      });
    } catch (error) {
      console.error('Test transformation error:', error);
      return [];
    }
  },

  /**
   * تبدیل جزئیات یک آزمایش خاص
   */
  transformTestDetails(rawData) {
    try {
      let data;
      if (Buffer.isBuffer(rawData)) {
        data = this.fixEncoding(rawData.toString('binary'));
        try {
          data = JSON.parse(data);
        } catch (e) {
          console.warn('Test details is not JSON');
          return null;
        }
      } else {
        data = rawData;
      }

      return {
        id: data.id || data.testId,
        testName: this.fixEncoding(data.testName || data.name),
        patientName: this.fixEncoding(data.patientName || data.name),
        nationalId: data.nationalId || data.code,
        testDate: this.convertToJalali(data.testDate || data.date),
        results: (data.results || []).map(result => ({
          parameter: this.fixEncoding(result.parameter || result.name),
          value: result.value,
          unit: this.fixEncoding(result.unit || ''),
          referenceRange: this.fixEncoding(result.referenceRange || result.normalRange || ''),
          status: this.determineStatus(result.value, result.referenceRange)
        })),
        doctorName: this.fixEncoding(data.doctorName || data.doctor || ''),
        notes: this.fixEncoding(data.notes || data.comment || ''),
        labName: this.fixEncoding(data.labName || 'آزمایشگاه پارسی‌پل')
      };
    } catch (error) {
      console.error('Test details transformation error:', error);
      return null;
    }
  },

  /**
   * تعیین وضعیت آزمایش (نرمال، بالا، پایین)
   */
  determineStatus(value, referenceRange) {
    if (!value || !referenceRange) {
      return 'unknown';
    }

    // استخراج محدوده مرجع (مثلاً: 3.5-5.5 یا 10-20)
    const rangeMatch = referenceRange.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/);
    if (!rangeMatch) {
      return 'unknown';
    }

    const min = parseFloat(rangeMatch[1]);
    const max = parseFloat(rangeMatch[2]);
    const numValue = parseFloat(value);

    if (isNaN(numValue)) {
      return 'unknown';
    }

    if (numValue < min) {
      return 'low';
    } else if (numValue > max) {
      return 'high';
    } else {
      return 'normal';
    }
  }
};

