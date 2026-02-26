// SEO Tools Configuration for UFAX9 Marketing Intelligence
// เชื่อมต่อกับ SEO Tools ต่างๆ

const SEO_CONFIG = {
  // Primary: SerpApi (ดึง Google ตรงๆ ง่ายสุด)
  serpapi: {
    enabled: true,
    apiKey: process.env.SERPAPI_KEY || '',
    baseUrl: 'https://serpapi.com/search',
    queries: [
      'แทงบอลออนไลน์',
      'คาสิโนออนไลน์',
      'บาคาร่า',
      'สล็อต',
      'ufabet',
      'sbobet'
    ]
  },
  
  // Secondary: Ubersuggest (ถ้ามี API Key)
  ubersuggest: {
    enabled: false,
    apiKey: process.env.UBERSUGGEST_KEY || '',
    baseUrl: 'https://api.neilpatel.com/v1'
  },
  
  // Tertiary: SEMrush (ถ้ามี API Key)
  semrush: {
    enabled: false,
    apiKey: process.env.SEMRUSH_KEY || '',
    baseUrl: 'https://api.semrush.com'
  }
};

// Keywords to track
const TRACKED_KEYWORDS = [
  // คำทั่วไป
  'แทงบอลออนไลน์',
  'คาสิโนออนไลน์',
  'บาคาร่า',
  'สล็อต',
  'หวยออนไลน์',
  'พนันบอล',
  'เว็บพนัน',
  
  // คู่แข่ง Brand
  'ufabet',
  'sbobet',
  'lsm99',
  'gclub',
  'holiday palace',
  'royal online',
  
  // Long-tail
  'แทงบอลเว็บไหนดี',
  'คาสิโนเว็บตรง',
  'บาคาร่าเว็บตรง',
  'สล็อตแตกง่าย',
  'เว็บพนันอันดับ1'
];

// Competitors to track
const COMPETITOR_DOMAINS = [
  'ufabet.com',
  'sbobet.com',
  'lsm99.com',
  'gclub.com',
  'holidaypalace.com',
  'royalonline.v2.com'
];

module.exports = {
  SEO_CONFIG,
  TRACKED_KEYWORDS,
  COMPETITOR_DOMAINS
};
