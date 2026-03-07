// FREE SEO Tools Configuration
// ใช้ SEO Tools ฟรี ไม่ต้องมี API Key

const FREE_SEO_CONFIG = {
  // 1. Google Trends ( scraping ผ่าน trending-google-search skill)
  googleTrends: {
    enabled: true,
    keywords: [
      'แทงบอล',
      'คาสิโน', 
      'บาคาร่า',
      'สล็อต',
      'ufabet',
      'sbobet'
    ],
    geo: 'TH', // Thailand
    timeRange: 'today 1-m' // 1 month
  },
  
  // 2. Direct Website Scraping (ดึงข้อมูลจากเว็บคู่แข่งตรงๆ)
  websiteScraping: {
    enabled: true,
    competitors: [
      { domain: 'ufabet.com', name: 'ufabet' },
      { domain: 'sbobet.com', name: 'sbobet' },
      { domain: 'lsm99.com', name: 'lsm99' },
      { domain: 'gclub.com', name: 'gclub' },
      { domain: 'holidaypalace.com', name: 'holiday' }
    ],
    extract: {
      title: true,
      metaDescription: true,
      keywords: true,
      headings: true, // h1, h2
      links: true,
      images: true
    }
  },
  
  // 3. SERP Scraping (ใช้ web_search skill ฟรี)
  serpScraping: {
    enabled: true,
    queries: [
      'แทงบอลออนไลน์ site:.com',
      'คาสิโนออนไลน์ 2026',
      'เว็บพนันอันดับ1',
      'บาคาร่าเว็บตรง',
      'สล็อตแตกง่าย'
    ],
    pages: 3 // ดึง 3 หน้าแรก
  },
  
  // 4. Free SEO Data Sources
  freeSources: {
    enabled: true,
    sources: [
      {
        name: 'Google Autocomplete',
        method: 'scrape',
        baseUrl: 'https://www.google.com/complete/search'
      },
      {
        name: 'Related Searches',
        method: 'scrape', 
        baseUrl: 'https://www.google.com/search'
      },
      {
        name: 'People Also Ask',
        method: 'scrape',
        baseUrl: 'https://www.google.com/search'
      }
    ]
  },
  
  // 5. Social Media SEO Signals
  socialSignals: {
    enabled: true,
    platforms: ['facebook', 'tiktok', 'twitter'],
    track: {
      hashtags: ['#แทงบอล', '#คาสิโน', '#ufabet', '#sbobet'],
      mentions: ['ufabet', 'sbobet', 'lsm99'],
      engagement: true
    }
  }
};

// Keywords to track (20+ คำ)
const TRACKED_KEYWORDS = [
  // หมวดหมู่: พนันกีฬา
  'แทงบอล',
  'แทงบอลออนไลน์',
  'พนันบอล',
  'บอลสเต็ป',
  'บอลเดี่ยว',
  'ราคาบอล',
  
  // หมวดหมู่: คาสิโน
  'คาสิโนออนไลน์',
  'บาคาร่า',
  'บาคาร่าออนไลน์',
  'สล็อต',
  'สล็อตออนไลน์',
  'รูเล็ต',
  'ไฮโล',
  'เสือมังกร',
  
  // หมวดหมู่: หวย
  'หวยออนไลน์',
  'หวยไทย',
  'หวยลาว',
  'หวยยี่กี',
  
  // หมวดหมู่: เว็บพนัน
  'เว็บพนัน',
  'เว็บพนันออนไลน์',
  'เว็บตรง',
  'เว็บพนันอันดับ1',
  'เว็บพนันที่ดีที่สุด',
  
  // หมวดหมู่: Brand
  'ufabet',
  'sbobet',
  'lsm99',
  'gclub',
  'royal online',
  'holiday palace',
  
  // Long-tail
  'แทงบอลเว็บไหนดี',
  'คาสิโนเว็บตรง',
  'บาคาร่าเว็บตรง',
  'สล็อตแตกง่าย',
  'สมัครแทงบอล',
  'เว็บพนันแจกเครดิตฟรี'
];

// Competitors to track
const COMPETITOR_SITES = [
  {
    name: 'ufabet',
    domains: ['ufabet.com', 'ufabet.co', 'ufabet.net'],
    keywords: ['ufabet', 'ยูฟ่าเบท']
  },
  {
    name: 'sbobet',
    domains: ['sbobet.com', 'sbobetmobile.com'],
    keywords: ['sbobet', 'สโบเบ็ต']
  },
  {
    name: 'lsm99',
    domains: ['lsm99.com', 'lsm99.net'],
    keywords: ['lsm99', 'แอลเอสเอ็ม']
  },
  {
    name: 'gclub',
    domains: ['gclub.com', 'gclub168.com'],
    keywords: ['gclub', 'จีคลับ']
  },
  {
    name: 'holiday',
    domains: ['holidaypalace.com', 'holiday-casino.com'],
    keywords: ['holiday palace', 'ฮอลิเดย์']
  },
  {
    name: 'royal',
    domains: ['royalonline.v2.com', 'royal1688.com'],
    keywords: ['royal online', 'royal']
  }
];

module.exports = {
  FREE_SEO_CONFIG,
  TRACKED_KEYWORDS,
  COMPETITOR_SITES
};
