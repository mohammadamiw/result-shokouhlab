/**
 * دسته‌بندی آزمایش‌ها بر اساس نام
 */

export const TEST_CATEGORIES = {
  hematology: {
    name: 'هماتولوژی',
    nameEn: 'Hematology (CBC)',
    description: 'آزمایش‌های تخصصی خون و سلول‌های خونی',
    icon: 'blood',
    color: '#dc2626',
    keywords: [
      // عمومی
      'CBC', 'Complete Blood Count', 'شمارش کامل خون',
      'Blood Count', 'خون کامل',
      
      // ۱. سلول‌های قرمز (Red Blood Cells)
      'RBC', 'R.B.C', 'Red Blood Cell', 'گلبول قرمز',
      'HGB', 'Hb', 'Hemoglobin', 'هموگلوبین',
      'HCT', 'Hematocrit', 'هماتوکریت',
      'MCV', 'M.C.V', 'Mean Corpuscular Volume', 'حجم متوسط گلبول',
      'MCH', 'M.C.H', 'Mean Corpuscular Hemoglobin',
      'MCHC', 'M.C.H.C', 'Mean Corpuscular Hemoglobin Concentration',
      'RDW', 'R.D.W', 'Red Cell Distribution Width', 'آنیزوسیتوز',
      
      // ۲. سلول‌های سفید (White Blood Cells)
      'WBC', 'W.B.C', 'White Blood Cell', 'گلبول سفید',
      'Diff', 'Differential', 'تفکیکی',
      'Neut', 'Neutrophil', 'نوتروفیل', 'Seg', 'Segmented', 'Band',
      'Neu%', 'Neut%',
      'Lymph', 'Lymphocyte', 'لنفوسیت',
      'Mono', 'Monocyte', 'مونوسیت',
      'Eos', 'Eosinophil', 'ائوزینوفیل', 'ایئوزینوفیل',
      'Baso', 'Basophil', 'بازوفیل',
      'Blast', 'بلاست',
      'Promyelocyte', 'پرومیلوسیت',
      'Myelocyte', 'میلوسیت',
      'Metamyelocyte', 'متامیلوسیت',
      
      // ۳. پلاکت‌ها (Platelets)
      'PLT', 'Platelet', 'پلاکت', 'ترومبوسیت',
      'MPV', 'M.P.V', 'Mean Platelet Volume', 'حجم متوسط پلاکت',
      'PDW', 'P.D.W', 'Platelet Distribution Width',
      'PCT', 'Plateletcrit', 'پلاکتوکریت',
      'P-LCR', 'Platelet Large Cell Ratio',
      
      // ۴. پارامترهای پیشرفته
      'NRBC', 'Nucleated RBC', 'گلبول قرمز هسته‌دار',
      'Retic', 'Reticulocyte', 'رتیکولوسیت', 'گلبول قرمز جوان',
      
      // سرعت رسوب
      'ESR', 'E.S.R', 'Sed Rate', 'سرعت رسوب', 'Erythrocyte Sedimentation',
      
      // شاخص‌های آهن و کم‌خونی
      'Iron', 'آهن', 'Fe',
      'Ferritin', 'فریتین',
      'TIBC', 'T.I.B.C', 'Total Iron Binding',
      'Transferrin', 'ترانسفرین',
      'Transferrin Sat', 'اشباع ترانسفرین',
      
      // ویتامین‌های خون‌ساز
      'B12', 'Vitamin B12', 'ویتامین B12', 'کوبالامین',
      'Folate', 'Folic Acid', 'اسید فولیک', 'فولات',
      
      // اسمیر خون و مورفولوژی
      'Blood Smear', 'اسمیر خون', 'PBS', 'Peripheral Blood Smear',
      'Morphology', 'مورفولوژی',
      'Anisocytosis', 'آنیزوسیتوز', 'Aniso',
      'Poikilocytosis', 'پویکیلوسیتوز',
      'Hypochromia', 'هیپوکرومی', 'Hypo',
      'Micro', 'Microcytic', 'میکروسیتیک',
      'Macrocytic', 'ماکروسیتیک',
      'Normocytic', 'نرموسیتیک',
      'Target Cell', 'سلول هدف',
      'Spherocyte', 'اسفروسیت',
      'Schistocyte', 'شیستوسیت'
    ]
  },
  coagulation: {
    name: 'انعقاد',
    nameEn: 'Coagulation',
    description: 'آزمایش‌های فاکتورهای انعقادی و لخته',
    icon: 'coagulation',
    color: '#7c3aed',
    keywords: [
      'PT', 'PTT', 'APTT', 'INR', 'Fibrinogen', 'D-Dimer', 'FDP',
      'Factor', 'Bleeding', 'Clotting', 'Thrombin',
      'Protein C', 'Protein S', 'Antithrombin',
      'انعقاد', 'لخته', 'فیبرینوژن'
    ]
  },
  biochemistry: {
    name: 'بیوشیمی',
    nameEn: 'Biochemistry',
    description: 'آزمایش‌های بیوشیمی عمومی، کلیوی، کبدی و متابولیک',
    icon: 'chemistry',
    color: '#2563eb',
    keywords: [],
    // زیرپروفایل‌های بیوشیمی
    profiles: {
      glucose: {
        name: 'پروفایل قند خون',
        nameEn: 'Glucose Profile',
        description: 'بررسی دیابت و متابولیسم کربوهیدرات',
        color: '#f59e0b',
        keywords: [
          'FBS', 'Fasting Blood Sugar', 'قند خون ناشتا', 'قند ناشتا',
          'Glucose', 'BS', 'Blood Sugar', 'قند خون', 'قند',
          'HbA1c', 'A1C', 'Hemoglobin A1c', 'هموگلوبین A1c', 'هموگلوبین گلیکوزیله',
          '2HPP', '2-Hour Postprandial', '2hpp', 'قند خون دو ساعت بعد از غذا', 'قند ۲ ساعته',
          'OGTT', 'Oral Glucose Tolerance Test', 'GTT', 'تست تحمل گلوکز',
          'Fructosamine', 'فروکتوزآمین',
          'Insulin', 'انسولین',
          'C-Peptide', 'سی پپتید'
        ]
      },
      lipid: {
        name: 'پروفایل چربی',
        nameEn: 'Lipid Profile',
        description: 'بررسی ریسک بیماری‌های قلبی و عروقی',
        color: '#ec4899',
        keywords: [
          'Chol', 'Cholesterol', 'Total Cholesterol', 'T.Chol', 'کلسترول', 'کلسترول کل',
          'TG', 'Triglycerides', 'Triglyceride', 'Trig', 'تری‌گلیسرید', 'چربی خون',
          'HDL', 'High-Density Lipoprotein', 'کلسترول خوب',
          'LDL', 'Low-Density Lipoprotein', 'کلسترول بد',
          'VLDL', 'Very Low-Density Lipoprotein', 'چربی‌های بسیار سبک',
          'Lipid Profile', 'پروفایل چربی', 'Lipid'
        ]
      },
      renal: {
        name: 'عملکرد کلیه',
        nameEn: 'Renal Function Test (RFT)',
        description: 'ارزیابی عملکرد کلیه‌ها',
        color: '#0891b2',
        keywords: [
          'BUN', 'Blood Urea Nitrogen', 'Urea', 'اوره', 'اوره خون', 'نیتروژن اوره',
          'Creat', 'Creatinine', 'Cr', 'کراتینین', 'کراتینین خون',
          'Uric Acid', 'Uric', 'اسید اوریک', 'نقرس',
          'eGFR', 'GFR', 'Estimated GFR', 'نرخ فیلتراسیون گلومرولی',
          'Cystatin', 'سیستاتین',
          'Microalbumin', 'میکروآلبومین',
          'Kidney', 'کلیه', 'Renal', 'RFT'
        ]
      },
      liver: {
        name: 'عملکرد کبد',
        nameEn: 'Liver Function Test (LFT)',
        description: 'تشخیص هپاتیت و آسیب‌های کبدی',
        color: '#84cc16',
        keywords: [
          'SGOT', 'AST', 'SGOT(AST)', 'آسپارتات', 'آسپارتات آمینوترانسفراز',
          'SGPT', 'ALT', 'SGPT(ALT)', 'آلانین ترانس آمیناز', 'آلانین آمینوترانسفراز',
          'ALP', 'Alkaline Phosphatase', 'آلکالین فسفاتاز',
          'GGT', 'Gamma GT', 'گاما',
          'LDH', 'Lactate Dehydrogenase', 'لاکتات دهیدروژناز',
          'Bili', 'Bilirubin', 'Total Bilirubin', 'Direct Bilirubin', 'Indirect Bilirubin',
          'T.Bil', 'D.Bil', 'بیلی‌روبین', 'زردی',
          'Alb', 'Albumin', 'آلبومین', 'آلبومین خون',
          'Total Protein', 'T.Protein', 'پروتئین تام',
          'Globulin', 'گلوبولین',
          'A/G Ratio',
          'Ammonia', 'آمونیاک',
          'Prealbumin', 'پره‌آلبومین',
          'Liver', 'کبد', 'Hepat', 'LFT'
        ]
      },
      electrolytes: {
        name: 'الکترولیت‌ها',
        nameEn: 'Electrolytes',
        description: 'تعادل مایعات و انتقال پیام‌های عصبی',
        color: '#6366f1',
        keywords: [
          'Na', 'Sodium', 'Na+', 'سدیم',
          'K', 'Potassium', 'K+', 'پتاسیم',
          'Ca', 'Calcium', 'Ca++', 'کلسیم',
          'P', 'Phosphorus', 'Phos', 'فسفر',
          'Mg', 'Magnesium', 'منیزیم',
          'Fe', 'Iron', 'آهن',
          'TIBC', 'Total Iron Binding Capacity', 'ظرفیت اتصال آهن',
          'Chloride', 'Cl-', 'Cl', 'کلر',
          'Bicarbonate', 'HCO3', 'بیکربنات',
          'Electrolyte', 'الکترولیت'
        ]
      },
      cardiac: {
        name: 'آنزیم‌های قلبی',
        nameEn: 'Cardiac Markers',
        description: 'تشخیص سکته قلبی و آسیب عضله قلب',
        color: '#ef4444',
        keywords: [
          'CPK', 'CK', 'Creatine Phosphokinase', 'کراتین فسفوکیناز',
          'CK-MB', 'CKMB', 'کراتین کیناز',
          'Troponin', 'Troponin I', 'Troponin T', 'تروپونین',
          'Myoglobin', 'میوگلوبین',
          'BNP', 'NT-proBNP', 'ProBNP',
          'Amylase', 'آمیلاز',
          'Lipase', 'لیپاز'
        ]
      }
    }
  },
  hormone: {
    name: 'هورمون‌ها',
    nameEn: 'Hormones & Endocrinology',
    description: 'تست‌های هورمونی و غدد درون‌ریز',
    icon: 'hormone',
    color: '#db2777',
    keywords: [],
    // زیرپروفایل‌های هورمونی
    profiles: {
      thyroid: {
        name: 'پنل تیروئید',
        nameEn: 'Thyroid Function Test (TFT)',
        description: 'پرکاربردترین پنل هورمونی - بررسی عملکرد غده تیروئید',
        color: '#059669',
        keywords: [
          'TSH', 'Thyroid Stimulating Hormone', 'هورمون محرک تیروئید',
          'T3', 'Triiodothyronine', 'تری‌یدوتیرونین',
          'T4', 'Thyroxine', 'تیروکسین',
          'Free T3', 'FT3', 'T3 Free', 'T3 آزاد',
          'Free T4', 'FT4', 'T4 Free', 'T4 آزاد',
          'Thyroid', 'تیروئید', 'TFT',
          'Anti-TPO', 'TPO', 'Anti Thyroid Peroxidase', 'آنتی TPO',
          'Anti-Thyroglobulin', 'Anti-Tg', 'Thyroglobulin', 'تیروگلوبولین',
          'Calcitonin', 'کلسی‌تونین',
          'TSH Receptor', 'TRAb'
        ]
      },
      reproductive: {
        name: 'هورمون‌های جنسی و باروری',
        nameEn: 'Reproductive Hormones',
        description: 'تشخیص مشکلات باروری، سیکل ماهانه و بلوغ',
        color: '#ec4899',
        keywords: [
          'LH', 'Luteinizing Hormone', 'هورمون لوتئینی', 'ال‌اچ',
          'FSH', 'Follicle Stimulating Hormone', 'هورمون محرک فولیکول', 'اف‌اس‌اچ',
          'Prolactin', 'PRL', 'پرولاکتین', 'هورمون شیردهی',
          'Testosterone', 'Total Testosterone', 'Free Testosterone', 'تستوسترون',
          'Estradiol', 'E2', 'استرادیول', 'هورمون جنسی زنانه',
          'Progesterone', 'پروژسترون',
          'DHEA-S', 'DHEAS', 'DHEA', 'هورمون پیش‌ساز جنسی',
          'AMH', 'Anti-Mullerian Hormone', 'ذخیره تخمدان', 'آنتی مولرین',
          'BhCG', 'Beta hCG', 'hCG', 'HCG', 'Beta-HCG', 'هورمون بارداری', 'بتا',
          'Inhibin', 'اینهیبین',
          'SHBG', 'Sex Hormone Binding Globulin'
        ]
      },
      adrenal: {
        name: 'غده فوق‌کلیوی و استرس',
        nameEn: 'Adrenal & Stress Hormones',
        description: 'پاسخ بدن به استرس و تنظیم فشار خون',
        color: '#f59e0b',
        keywords: [
          'Cortisol', 'کورتیزول', 'هورمون استرس',
          'ACTH', 'Adrenocorticotropic Hormone', 'هورمون محرک فوق‌کلیوی',
          'Aldosterone', 'آلدوسترون',
          'Renin', 'رنین',
          'Adrenaline', 'Epinephrine', 'آدرنالین', 'اپی‌نفرین',
          'Noradrenaline', 'Norepinephrine', 'نورآدرنالین',
          'Catecholamine', 'کاتکول‌آمین',
          'Metanephrine', 'متانفرین',
          'VMA', 'Vanillylmandelic Acid'
        ]
      },
      growth: {
        name: 'هورمون‌های رشد و استخوان',
        nameEn: 'Growth & Bone Metabolism',
        description: 'رشد، متابولیسم کلسیم و سلامت استخوان',
        color: '#8b5cf6',
        keywords: [
          'GH', 'Growth Hormone', 'هورمون رشد',
          'IGF-1', 'IGF1', 'Insulin-like Growth Factor', 'واسطه هورمون رشد',
          'PTH', 'Parathyroid Hormone', 'هورمون پارادیروئید', 'پاراتورمون',
          'Vitamin D', '25-OH Vitamin D', '25-Hydroxyvitamin D', 'ویتامین D', 'ویتامین دی',
          '1,25-OH Vitamin D', '1,25-Dihydroxyvitamin D',
          'Osteocalcin', 'استئوکلسین',
          'CTX', 'C-Telopeptide',
          'P1NP', 'Procollagen'
        ]
      },
      metabolic: {
        name: 'مارکرهای متابولیک',
        nameEn: 'Metabolic Markers',
        description: 'ذخایر آهن، ویتامین‌ها و ریسک قلبی',
        color: '#0ea5e9',
        keywords: [
          'Ferritin', 'فریتین', 'ذخیره آهن',
          'Vitamin B12', 'B12', 'ویتامین B12', 'ویتامین ب۱۲',
          'Folate', 'Folic Acid', 'فولات', 'اسید فولیک',
          'Insulin', 'Fasting Insulin', 'انسولین ناشتا', 'انسولین',
          'Homocysteine', 'هموسیستئین',
          'Leptin', 'لپتین',
          'Adiponectin', 'آدیپونکتین'
        ]
      }
    }
  },
  immunology: {
    name: 'ایمونولوژی',
    nameEn: 'Immunology & Rheumatology',
    description: 'آزمایش‌های سیستم ایمنی، روماتیسمی و التهابی',
    icon: 'immunity',
    color: '#6366f1',
    keywords: [
      // ۲. پنل بیماری‌های روماتیسمی و التهابی (Rheumatology)
      'RF', 'Rheumatoid Factor', 'Rheumatoid', 'فاکتور روماتوئید', 'آرتریت روماتوئید',
      'CRP', 'C-Reactive Protein', 'C Reactive Protein', 'پروتئین فاز حاد', 'پروتئین C واکنشی',
      'hs-CRP', 'High Sensitivity CRP', 'CRP حساسیت بالا',
      'ANA', 'Anti-Nuclear', 'Antinuclear Antibody', 'آنتی‌بادی ضد هسته', 'لوپوس',
      'Anti-CCP', 'CCP', 'Anti-Cyclic Citrullinated Peptide', 'CCP Antibody', 'تشخیص زودرس روماتیسم',
      
      // سیستم ایمنی
      'IgG', 'IgA', 'IgM', 'IgE', 'IgD',
      'Immunoglobulin', 'ایمونوگلوبولین',
      'Anti-dsDNA', 'dsDNA', 'Anti-dsDNA Antibody',
      'Complement', 'C3', 'C4',
      'ANCA', 'پانکا', 'Anti-Neutrophil Cytoplasmic', 'Anti-Neutrophil Cytoplasmic Antibody',
      
      // مارکرهای قلبی و التهابی (Special Tests)
      'Ferritin', 'فریتین',
      'Vitamin B12', 'B12', 'Vitamin B 12', 'کوبالامین',
      'Folate', 'Folic Acid', 'اسید فولیک', 'فولات',
      'Insulin Fasting', 'Fasting Insulin', 'انسولین ناشتا',
      'Homocysteine', 'هموسیستئین',
      
      // سایر تست‌های ایمونولوژی
      'Autoantibody', 'اتوآنتی‌بادی', 'Autoimmune',
      'Lupus', 'SLE', 'Systemic Lupus Erythematosus',
      'Rheumatology', 'روماتیسم', 'روماتولوژی'
    ]
  },
  infection: {
    name: 'عفونی',
    nameEn: 'Infectious Diseases & Serology',
    description: 'تست‌های سرولوژی و تشخیص عفونت‌های باکتریایی و ویروسی',
    icon: 'virus',
    color: '#ea580c',
    keywords: [
      // ۱. تست‌های عفونت‌های باکتریایی (Bacterial Serology)
      'Wright', 'Wright Test', 'تب مالت', 'Brucellosis',
      '2ME', '2-Mercaptoethanol', '2 Mercaptoethanol',
      'Coombs Wright', 'Coombs-Wright',
      'Widal', 'Widal Test', 'حصبه', 'تب تیفوئید', 'Typhoid',
      'ASO', 'Anti-Streptolysin O', 'Anti Streptolysin', 'استرپتوکوکی',
      'RPR', 'Rapid Plasma Reagin', 'سیفلیس',
      'VDRL', 'Venereal Disease Research Laboratory', 'سیفلیس',
      'Syphilis', 'سیفلیس',
      
      // ۲. پنل هپاتیت‌های ویروسی (Viral Hepatitis Panel)
      'HBs Ag', 'HBsAg', 'HBs-Ag', 'Hepatitis B Surface Antigen', 'آنتی‌ژن سطحی هپاتیت B',
      'HBs Ab', 'HBsAb', 'HBs-Ab', 'Hepatitis B Surface Antibody', 'آنتی‌بادی هپاتیت B',
      'HBe Ag', 'HBeAg', 'HBe-Ag', 'Hepatitis B e Antigen',
      'HBe Ab', 'HBeAb', 'HBe-Ab', 'Hepatitis B e Antibody',
      'HBc Ab', 'HBcAb', 'HBc-Ab', 'Hepatitis B Core Antibody', 'Total HBc', 'HBc IgM',
      'HCV Ab', 'HCVAb', 'HCV-Ab', 'Hepatitis C Antibody', 'آنتی‌بادی هپاتیت C',
      'HBV', 'HCV', 'HBS', 'HBC', 'Hepatitis', 'هپاتیت',
      
      // ۳. عفونت‌های خاص و ویروسی (Special Viral Tests)
      'HIV', 'HIV Ab', 'HIV Ag', 'HIV 1', 'HIV 2', 'HIV 1&2', 'ایدز', 'AIDS',
      'HTLV', 'HTLV-1', 'HTLV-2', 'HTLV 1', 'HTLV 2', 'Human T-Lymphotropic Virus',
      'ToRCH', 'TORCH', 'Toxoplasmosis', 'Rubella', 'CMV', 'Herpes', 'HSV',
      'Toxoplasma', 'توکسوپلاسما',
      'Rubella', 'سرخجه',
      'CMV', 'Cytomegalovirus', 'سی‌ام‌وی',
      'EBV', 'Epstein-Barr Virus', 'Monospot', 'Monospot Test', 'مونوکلئوز',
      'HSV', 'Herpes Simplex Virus', 'هرپس',
      
      // ۴. تست‌های جدید و ترند (Infectious Serology)
      'COVID', 'COVID-19', 'Corona', 'کووید', 'SARS-CoV-2',
      'COVID Ab', 'COVID IgG', 'COVID IgM', 'COVID Antibody',
      'H. Pylori', 'Helicobacter Pylori', 'H Pylori Ab', 'H. Pylori IgG', 'H. Pylori IgA', 'هلیکوباکتر',
      
      // سایر
      'TB', 'Tuberculosis', 'سل',
      'Culture', 'کشت', 'Bacterial Culture',
      'Serology', 'سرولوژی'
    ]
  },
  urine: {
    name: 'آنالیز ادرار',
    nameEn: 'Urinalysis (UA & UC)',
    description: 'آزمایش‌های کامل ادرار شامل بررسی ظاهری، شیمیایی و میکروسکوپی',
    icon: 'urine',
    color: '#eab308',
    keywords: [
      // عمومی - فقط کلمات خاص ادرار
      'Urine', 'ادرار', 'U/A', 'UA', 'U.A', 'UC', 'U/C', 'U.C',
      'Urinalysis', 'آنالیز ادرار',
      '24h Urine', '24 hour Urine', '24 ساعته',
      'Creatinine Clearance',
      
      // بررسی ظاهری (Physical) - کلمات منحصر به ادرار
      'Color', 'رنگ',
      'Appearance', 'App.', 'App', 'ظاهر', 'شفافیت', 'Clarity',
      'Sp.G', 'Sp.Gr', 'S.G.', 'Specific Gravity', 'وزن مخصوص',
      'PH', 'pH',
      
      // بررسی شیمیایی (Dipstick) - کلمات منحصر به ادرار
      'Ketone', 'کتون', 'Acetone',
      'Urobilinogen', 'اوروبیلینوژن',
      'Nitrite', 'نیتریت',
      'Leukocyte Esterase', 'LE',
      'Ascorbic Acid', 'اسید آسکوربیک', 'ویتامین C ادرار',
      
      // بررسی میکروسکوپی - کلمات منحصر به ادرار
      'Ep.', 'Epi.', 'Epithelial', 'اپیتلیال', 'سلول پوششی',
      'Pus Cell', 'پوس سل', 'Pus',
      'Cast', 'کست', 'سیلندر', 'Hyaline Cast', 'Granular Cast', 'RBC Cast', 'WBC Cast',
      'Crystal', 'Cryst', 'کریستال', 'Oxalate', 'اگزالات', 'Triple Phosphate', 'Uric Crystal',
      'Bact.', 'Bact', 'باکتری ادرار', 'Bacteria',
      'Yeast', 'مخمر',
      'Mucus', 'موکوس',
      'Amorphous', 'آمورف',
      'Sperm', 'اسپرم',
      'Others', 'سایر',
      'comment', 'توضیحات'
    ]
  },
  bodyFluids: {
    name: 'مایعات بدن',
    nameEn: 'Body Fluids Analysis',
    description: 'آنالیز مایعات مغزی-نخاعی، مفصلی، پلور و صفاقی',
    icon: 'fluids',
    color: '#06b6d4',
    keywords: [
      // مایع مغزی-نخاعی
      'CSF', 'Cerebrospinal', 'مایع نخاعی', 'مایع مغزی',
      // مایع مفصلی
      'Synovial', 'سینوویال', 'مایع مفصلی', 'Joint Fluid',
      // مایع پلور
      'Pleural', 'پلورال', 'مایع ریه', 'مایع جنب',
      // مایع صفاقی
      'Peritoneal', 'Ascitic', 'آسیت', 'مایع شکمی', 'مایع صفاقی',
      // مایع پریکارد
      'Pericardial', 'پریکارد',
      // پارامترهای مشترک
      'Cell Count', 'شمارش سلول',
      'Differential', 'تفکیکی',
      'PMN', 'پلی‌مورف',
      'Transudate', 'ترانسودا',
      'Exudate', 'اگزودا',
      'Gram Stain', 'گرم استین', 'رنگ‌آمیزی گرم'
    ]
  },
  tumor: {
    name: 'تومور مارکر',
    nameEn: 'Tumor Markers',
    description: 'شاخص‌های غربالگری و پایش سرطان',
    icon: 'tumor',
    color: '#9333ea',
    keywords: [
      // تومور مارکرهای عمومی
      'Tumor Marker', 'Tumor', 'تومور مارکر', 'تومور',
      'Marker', 'مارکر',
      
      // پروستات
      'PSA', 'Prostate Specific Antigen', 'Total PSA', 'Free PSA', 'پی‌اس‌ای',
      
      // گوارشی
      'CEA', 'Carcinoembryonic Antigen', 'مارکر عمومی گوارشی',
      
      // تخمدان
      'CA-125', 'CA125', 'CA 125', 'Cancer Antigen 125', 'مخصوص تخمدان',
      
      // سینه
      'CA-15-3', 'CA153', 'CA 15-3', 'Cancer Antigen 15-3', 'مخصوص سینه',
      
      // پانکراس
      'CA-19-9', 'CA199', 'CA 19-9', 'Cancer Antigen 19-9',
      
      // کبد و جنینی
      'AFP', 'Alpha-Fetoprotein', 'آلفا فیتوپروتئین', 'مارکر کبدی',
      
      // سایر
      'Beta-HCG', 'BhCG', 'HCG', 'Human Chorionic Gonadotropin'
    ]
  },
  other: {
    name: 'سایر',
    nameEn: 'Other Tests',
    description: 'سایر آزمایش‌ها',
    icon: 'other',
    color: '#64748b',
    keywords: []
  }
};

/**
 * تشخیص دسته‌بندی آزمایش بر اساس نام و نتیجه
 * اولویت‌بندی: ادرار و مایعات بدن قبل از بیوشیمی بررسی می‌شوند
 * 
 * @param {string} testName - نام آزمایش
 * @param {string} result - نتیجه آزمایش (اختیاری - برای تفکیک تست‌های مشترک)
 * @param {string} normalRange - محدوده نرمال (اختیاری)
 */
export function categorizeTest(testName, result = '', normalRange = '') {
  if (!testName) return 'other';
  
  const normalizedName = testName.toLowerCase().trim();
  const normalizedResult = (result || '').toString().toLowerCase().trim();
  const normalizedRange = (normalRange || '').toString().toLowerCase().trim();
  
  // ===== تشخیص آزمایش‌های ادرار با فرمت نتیجه =====
  // اگر نتیجه به فرمت ادرار باشه (Negative, Trace, +, ++, +++, 0-1, 10-15, etc.)
  const isUrineResultFormat = 
    normalizedResult === 'negative' ||
    normalizedResult === 'positive' ||
    normalizedResult === 'trace' ||
    normalizedResult === '$' ||
    /^[\+]+$/.test(normalizedResult) ||  // +, ++, +++
    /^\d+-\d+$/.test(normalizedResult);  // 0-1, 10-15
  
  // تست‌های مشترک بین ادرار و هماتولوژی
  const ambiguousTests = ['rbc', 'r.b.c', 'wbc', 'w.b.c', 'blood', 'protein', 'bilirubin', 'ph'];
  const isAmbiguous = ambiguousTests.some(t => normalizedName.includes(t));
  
  // اگر نام مشترک باشه و فرمت نتیجه ادرار باشه → ادرار
  if (isAmbiguous && isUrineResultFormat) {
    return 'urine';
  }
  
  // ===== کلمات کلیدی خاص ادرار که فقط در ادرار هستند =====
  const urineOnlyKeywords = [
    'sp.g', 'sp.gr', 's.g.', 'specific gravity',
    'app', 'app.', 'appearance',
    'ph', 'ph.',
    'ep.', 'epi.', 'epithelial',
    'cast', 'کست', 'سیلندر',
    'crystal', 'cryst', 'کریستال',
    'bact.', 'bact',
    'pus', 'پوس',
    'nitrite', 'نیتریت',
    'ketone', 'کتون',
    'urobilinogen',
    'ascorbic',
    'mucus', 'موکوس',
    'amorphous', 'آمورف',
    'sperm', 'اسپرم',
    'yeast', 'مخمر',
    'urine', 'ادرار', 'u/a', 'u.a', 'uc', 'u/c'
  ];
  
  for (const keyword of urineOnlyKeywords) {
    if (normalizedName.includes(keyword)) {
      return 'urine';
    }
  }
  
  // ===== بررسی پروفایل‌های بیوشیمی =====
  const biochem = TEST_CATEGORIES.biochemistry;
  if (biochem && biochem.profiles) {
    for (const [profileKey, profile] of Object.entries(biochem.profiles)) {
      for (const keyword of profile.keywords) {
        if (normalizedName.includes(keyword.toLowerCase())) {
          return 'biochemistry';
        }
      }
    }
  }
  
  // ===== بررسی پروفایل‌های هورمونی =====
  const hormone = TEST_CATEGORIES.hormone;
  if (hormone && hormone.profiles) {
    for (const [profileKey, profile] of Object.entries(hormone.profiles)) {
      for (const keyword of profile.keywords) {
        if (normalizedName.includes(keyword.toLowerCase())) {
          return 'hormone';
        }
      }
    }
  }
  
  // ===== ترتیب اولویت دسته‌ها =====
  const priorityOrder = [
    'bodyFluids',   // مایعات بدن
    'tumor',        // تومور مارکر
    'coagulation',  // انعقاد
    'hematology',   // هماتولوژی
    'immunology',   // ایمونولوژی
    'infection',    // عفونی
    'urine',        // ادرار (اگر بالا پیدا نشد)
  ];
  
  for (const categoryKey of priorityOrder) {
    const category = TEST_CATEGORIES[categoryKey];
    if (!category) continue;
    
    for (const keyword of category.keywords) {
      if (normalizedName.includes(keyword.toLowerCase())) {
        return categoryKey;
      }
    }
  }
  
  return 'other';
}

/**
 * تشخیص پروفایل بیوشیمی یک تست
 */
export function getBiochemistryProfile(testName) {
  if (!testName) return null;
  
  const normalizedName = testName.toLowerCase().trim();
  const biochem = TEST_CATEGORIES.biochemistry;
  
  if (biochem && biochem.profiles) {
    for (const [profileKey, profile] of Object.entries(biochem.profiles)) {
      for (const keyword of profile.keywords) {
        if (normalizedName.includes(keyword.toLowerCase())) {
          return { key: profileKey, ...profile };
        }
      }
    }
  }
  
  return null;
}

/**
 * گروه‌بندی تست‌های بیوشیمی بر اساس پروفایل
 */
export function groupBiochemistryByProfile(tests) {
  const grouped = {};
  const biochem = TEST_CATEGORIES.biochemistry;
  
  if (!biochem || !biochem.profiles) return { other: tests };
  
  // ایجاد دسته‌های خالی برای هر پروفایل
  for (const [key, profile] of Object.entries(biochem.profiles)) {
    grouped[key] = {
      name: profile.name,
      nameEn: profile.nameEn,
      description: profile.description,
      color: profile.color,
      tests: []
    };
  }
  grouped.other = {
    name: 'سایر',
    nameEn: 'Other',
    description: '',
    color: '#64748b',
    tests: []
  };
  
  // دسته‌بندی تست‌ها
  for (const test of tests) {
    const profile = getBiochemistryProfile(test.testName);
    if (profile) {
      grouped[profile.key].tests.push(test);
    } else {
      grouped.other.tests.push(test);
    }
  }
  
  // حذف پروفایل‌های خالی
  for (const key of Object.keys(grouped)) {
    if (grouped[key].tests.length === 0) {
      delete grouped[key];
    }
  }
  
  return grouped;
}

/**
 * تشخیص پروفایل هورمونی یک تست
 */
export function getHormoneProfile(testName) {
  if (!testName) return null;
  
  const normalizedName = testName.toLowerCase().trim();
  const hormone = TEST_CATEGORIES.hormone;
  
  if (hormone && hormone.profiles) {
    for (const [profileKey, profile] of Object.entries(hormone.profiles)) {
      for (const keyword of profile.keywords) {
        if (normalizedName.includes(keyword.toLowerCase())) {
          return { key: profileKey, ...profile };
        }
      }
    }
  }
  
  return null;
}

/**
 * گروه‌بندی تست‌های هورمونی بر اساس پروفایل
 */
export function groupHormoneByProfile(tests) {
  const grouped = {};
  const hormone = TEST_CATEGORIES.hormone;
  
  if (!hormone || !hormone.profiles) return { other: { name: 'سایر', tests } };
  
  // ایجاد دسته‌های خالی برای هر پروفایل
  for (const [key, profile] of Object.entries(hormone.profiles)) {
    grouped[key] = {
      name: profile.name,
      nameEn: profile.nameEn,
      description: profile.description,
      color: profile.color,
      tests: []
    };
  }
  grouped.other = {
    name: 'سایر',
    nameEn: 'Other',
    description: '',
    color: '#64748b',
    tests: []
  };
  
  // دسته‌بندی تست‌ها
  for (const test of tests) {
    const profile = getHormoneProfile(test.testName);
    if (profile) {
      grouped[profile.key].tests.push(test);
    } else {
      grouped.other.tests.push(test);
    }
  }
  
  // حذف پروفایل‌های خالی
  for (const key of Object.keys(grouped)) {
    if (grouped[key].tests.length === 0) {
      delete grouped[key];
    }
  }
  
  return grouped;
}

/**
 * گروه‌بندی آزمایش‌ها بر اساس دسته
 */
export function groupTestsByCategory(tests) {
  const grouped = {};
  
  // ایجاد دسته‌های خالی
  for (const key of Object.keys(TEST_CATEGORIES)) {
    grouped[key] = [];
  }
  
  // دسته‌بندی آزمایش‌ها
  for (const test of tests) {
    // ارسال نتیجه و محدوده نرمال برای تشخیص بهتر (مثلاً RBC ادرار vs RBC خون)
    const category = categorizeTest(test.testName, test.result, test.normalRange);
    grouped[category].push(test);
  }
  
  // حذف دسته‌های خالی
  for (const key of Object.keys(grouped)) {
    if (grouped[key].length === 0) {
      delete grouped[key];
    }
  }
  
  return grouped;
}

