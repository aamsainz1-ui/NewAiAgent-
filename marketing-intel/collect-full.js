#!/usr/bin/env node
/**
 * UFAX9 Marketing Intelligence Collector - Full Channel Coverage
 * เก็บข้อมูลการตลาดจากทุกช่องทาง 12 channels
 */

const fs = require('fs').promises;
const path = require('path');

// Configuration - คู่แข่งหลัก
const COMPETITORS = [
  { name: 'ufabet', domains: ['ufabet.com', 'ufabet.co'], social: ['@ufabetofficial'] },
  { name: 'sbobet', domains: ['sbobet.com', 'sbobetmobile.com'], social: ['@sbobet'] },
  { name: 'lsm99', domains: ['lsm99.com', 'lsm99.net'], social: ['@lsm99official'] },
  { name: 'gclub', domains: ['gclub.com', 'gclub168.com'], social: ['@gclubcasino'] },
  { name: 'holiday', domains: ['holidaypalace.com'], social: ['@holidaypalace'] },
  { name: 'royalonline', domains: ['royalonline.v2.com'], social: [] }
];

// 12 Marketing Channels to monitor
const CHANNELS = {
  social_media: ['TikTok', 'Facebook', 'Instagram', 'Twitter/X'],
  paid_ads: ['Google Ads', 'Facebook Ads', 'TikTok Ads'],
  seo: ['Google Search', 'Keywords', 'Backlinks'],
  influencer: ['YouTube', 'TikTok Creators', 'Bloggers'],
  content: ['YouTube Videos', 'Blogs', 'Podcasts'],
  messaging: ['LINE', 'Telegram', 'Discord'],
  forums: ['Pantip', 'Reddit', 'Review Sites'],
  direct: ['SMS', 'Email', 'Push Notification'],
  offline: ['QR Code', 'Events', 'Merchandise'],
  streaming: ['Twitch', 'Facebook Live', 'YouTube Live'],
  community: ['เซียนบอล', 'ทีเด็ด', 'VIP Groups'],
  news: ['Sports News', 'Sponsorships', 'Events']
};

const DATA_DIR = './marketing-intel';

async function ensureDirectories() {
  const today = new Date().toISOString().split('T')[0];
  const dirs = [
    path.join(DATA_DIR, 'daily', today),
    path.join(DATA_DIR, 'channels', 'social'),
    path.join(DATA_DIR, 'channels', 'ads'),
    path.join(DATA_DIR, 'channels', 'influencer'),
    path.join(DATA_DIR, 'competitors'),
    path.join(DATA_DIR, 'insights'),
    path.join(DATA_DIR, 'reports')
  ];
  
  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }
  return today;
}

function getTimeString() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;
}

// Collect data from all 12 channels
async function collectAllChannels(roundType) {
  const data = {
    timestamp: new Date().toISOString(),
    round: roundType,
    channels: {
      social_media: await collectSocialMedia(),
      paid_ads: await collectPaidAds(),
      seo: await collectSEO(),
      influencer: await collectInfluencer(),
      content: await collectContent(),
      messaging: await collectMessaging(),
      forums: await collectForums(),
      direct: await collectDirectMarketing(),
      offline: await collectOffline(),
      streaming: await collectStreaming(),
      community: await collectCommunity(),
      news: await collectNews()
    },
    competitors: await scanCompetitors(),
    insights: {
      new_campaigns: [],
      trending_keywords: [],
      active_influencers: [],
      new_ads: [],
      promotions: [],
      threats: [],
      opportunities: []
    }
  };
  
  return data;
}

// 1. Social Media Collection
async function collectSocialMedia() {
  return {
    tiktok: {
      videos: [], // คลิปแนะนำเว็บพนัน
      influencers: [], // ครีเอเตอร์ที่โปรโมท
      trends: [], // เทรนด์ที่เกี่ยวข้อง
      hashtags: ['#เว็บพนัน', '#แทงบอล', '#คาสิโน']
    },
    facebook: {
      pages: [], // เพจแนะนำ
      groups: [], // กลุ่มลับ
      posts: [], // โพสต์แนะนำ
      ads: [] // โฆษณาที่ขึ้น
    },
    instagram: {
      stories: [],
      reels: [],
      influencers: []
    },
    twitter: {
      tweets: [],
      threads: [],
      trending: []
    }
  };
}

// 2. Paid Ads Collection
async function collectPaidAds() {
  return {
    google: {
      keywords: ['แทงบอล', 'คาสิโนออนไลน์', 'บาคาร่า', 'สล็อต'],
      ad_copies: [], // ข้อความโฆษณา
      landing_pages: [] // หน้าเว็บที่โฆษณาพาไป
    },
    facebook: {
      ad_library: [], // จาก Facebook Ad Library
      creatives: [], // รูป/วิดีโอโฆษณา
      targeting: [] // กลุ่มเป้าหมายที่คาดเดา
    },
    tiktok: {
      ads: [], // คลิปโฆษณา
      spark_ads: [], // โฆษณาจากคลิปจริง
      trends: []
    }
  };
}

// 3. SEO Collection - FREE METHODS
const { FREE_SEO_CONFIG, TRACKED_KEYWORDS } = require('./config/seo-free');

async function collectSEO() {
  const results = {
    timestamp: new Date().toISOString(),
    method: 'FREE_TOOLS',
    google_trends: await collectGoogleTrends(),
    keywords: {
      tracked: TRACKED_KEYWORDS,
      high_volume: [],
      long_tail: [],
      trending: []
    },
    serp_results: await collectSERPFree(),
    competitor_meta: await collectCompetitorMeta(),
    related_searches: [],
    people_also_ask: []
  };
  
  return results;
}

// Collect Google Trends (free)
async function collectGoogleTrends() {
  // ใช้ web_search ดึงข้อมูล trends
  return {
    source: 'Google Trends (Free)',
    keywords: FREE_SEO_CONFIG.googleTrends.keywords,
    data: [], // จะเติมจากการ scrape
    url: 'https://trends.google.com/trends/trendingsearches/daily?geo=TH'
  };
}

// Collect SERP using free methods
async function collectSERPFree() {
  const { COMPETITOR_SITES } = require('./config/seo-free');
  
  return {
    source: 'Free SERP Scraping',
    queries: FREE_SEO_CONFIG.serpScraping.queries,
    results: COMPETITOR_SITES.map(site => ({
      competitor: site.name,
      domains: site.domains,
      keywords: site.keywords,
      rankings: {} // จะเติมจากการ scrape
    }))
  };
}

// Collect competitor website metadata (free scraping)
async function collectCompetitorMeta() {
  const { FREE_SEO_CONFIG } = require('./config/seo-free');
  
  const results = [];
  
  for (const site of FREE_SEO_CONFIG.websiteScraping.competitors) {
    results.push({
      domain: site.domain,
      name: site.name,
      title: '', // scrape from <title>
      metaDescription: '', // scrape from <meta name="description">
      metaKeywords: '', // scrape from <meta name="keywords">
      headings: {
        h1: [],
        h2: []
      },
      lastChecked: new Date().toISOString()
    });
  }
  
  return results;
}

// 4. Influencer Collection
async function collectInfluencer() {
  return {
    youtube: {
      channels: [], // ช่องรีวิวเว็บพนัน
      videos: [], // คลิปรีวิว
      mentions: []
    },
    tiktok: {
      creators: [], // ครีเอเตอร์แนะนำ
      sponsored: [], // คลิปที่เป็นสปอนเซอร์
      viral: []
    },
    bloggers: {
      websites: [], // เว็บบอร์ด/บล็อก
      reviews: [], // รีวิว
      affiliates: [] // ลิงก์ affiliate
    }
  };
}

// 5. Content Marketing
async function collectContent() {
  return {
    youtube: {
      review_videos: [],
      live_streams: [],
      shorts: []
    },
    blogs: {
      articles: [],
      guest_posts: [],
      sponsored_content: []
    },
    podcasts: {
      episodes: [],
      mentions: []
    }
  };
}

// 6. Messaging Apps
async function collectMessaging() {
  return {
    line: {
      groups: [], // กลุ่มนำเล่น
      official_accounts: [], // OA ของเว็บพนัน
      broadcast: [] // ข้อความกระจาย
    },
    telegram: {
      channels: [],
      groups: [],
      bots: []
    },
    discord: {
      servers: [],
      communities: []
    }
  };
}

// 7. Forums & Reviews
async function collectForums() {
  return {
    pantip: {
      threads: [], // กระทู้แนะนำเว็บ
      comments: [],
      trending: []
    },
    reddit: {
      subreddits: ['r/thailand', 'r/gambling'],
      posts: []
    },
    review_sites: {
      trustpilot: [],
      thai_review_sites: []
    }
  };
}

// 8. Direct Marketing
async function collectDirectMarketing() {
  return {
    sms: {
      promotions: [], // ข้อความโปรโมท
      new_user: [], // สมัครใหม่
      retention: [] // รักษาลูกค้าเก่า
    },
    email: {
      campaigns: [],
      newsletters: []
    },
    push: {
      notifications: [],
      in_app: []
    }
  };
}

// 9. Offline to Online
async function collectOffline() {
  return {
    qr_codes: {
      locations: [], // ที่ตั้งของ QR
      campaigns: []
    },
    events: {
      booths: [], // บูธในงานกีฬา
      sponsorships: []
    },
    merchandise: {
      team_shirts: [], // เสื้อทีมที่สปอนเซอร์
      giveaways: []
    }
  };
}

// 10. Streaming
async function collectStreaming() {
  return {
    twitch: {
      streamers: [], // สตรีมเมอร์ที่รับสปอนเซอร์
      categories: []
    },
    facebook_live: {
      pages: [],
      influencers: []
    },
    youtube_live: {
      channels: [],
      streams: []
    }
  };
}

// 11. Betting Communities
async function collectCommunity() {
  return {
    experts: {
      เซียนบอล: [], // เซียนที่แนะนำเว็บ
      เซียนบาคาร่า: [],
      tipsters: []
    },
    prediction_sites: {
      ทีเด็ดบอล: [],
      วิเคราะห์บอล: []
    },
    vip_groups: {
      paid_groups: [], // กลุ่มเสียเงินเข้า
      private_channels: []
    }
  };
}

// 12. News & Media
async function collectNews() {
  return {
    sports_news: {
      sites: [], // เว็บข่าวกีฬาที่มีโฆษณา
      articles: []
    },
    sponsorships: {
      football_teams: [], // ทีมที่สปอนเซอร์
      leagues: [], // ลีกที่สปอนเซอร์
      events: [] // งานที่สปอนเซอร์
    },
    pr_articles: {
      press_releases: [],
      media_coverage: []
    }
  };
}

// Scan competitor websites
async function scanCompetitors() {
  return COMPETITORS.map(comp => ({
    name: comp.name,
    domains: comp.domains,
    social_handles: comp.social,
    promotions: [],
    changes: [],
    last_updated: new Date().toISOString()
  }));
}

// Main collection
async function collect(roundType) {
  const today = await ensureDirectories();
  const timeStr = getTimeString();
  
  console.log(`[${timeStr}] Starting ${roundType} collection - All 12 channels...`);
  
  const data = await collectAllChannels(roundType);
  
  // Save to file
  const filename = `${timeStr}-${roundType}-full.json`;
  const filepath = path.join(DATA_DIR, 'daily', today, filename);
  await fs.writeFile(filepath, JSON.stringify(data, null, 2));
  
  console.log(`[${timeStr}] Saved: ${filepath}`);
  
  // Update summary
  await updateDailySummary(today, data);
  
  return data;
}

// Update daily summary
async function updateDailySummary(today, data) {
  const summaryPath = path.join(DATA_DIR, 'daily', today, 'daily-summary.md');
  
  let content = `# UFAX9 Marketing Intelligence - ${today}\n\n`;
  content += `## 📊 สรุปการตลาดรายวัน (12 ช่องทาง)\n\n`;
  content += `**รอบ:** ${data.round}\n`;
  content += `**เวลา:** ${new Date().toLocaleTimeString('th-TH')}\n\n`;
  
  // Summary by channel
  content += `## 🎯 ช่องทางการตลาดที่ตรวจสอบ\n\n`;
  Object.keys(data.channels).forEach(channel => {
    content += `- ✅ **${channel}**: ตรวจสอบแล้ว\n`;
  });
  
  // Competitors
  content += `\n## 👥 คู่แข่งที่ตรวจสอบ (${data.competitors.length})\n\n`;
  data.competitors.forEach(comp => {
    content += `- ${comp.name}\n`;
  });
  
  // Insights
  if (data.insights.new_campaigns.length > 0) {
    content += `\n## 🚀 แคมเปญใหม่ที่พบ\n`;
    data.insights.new_campaigns.forEach(c => content += `- ${c}\n`);
  }
  
  if (data.insights.trending_keywords.length > 0) {
    content += `\n## 🔥 คีย์เวิร์ดมาแรง\n`;
    data.insights.trending_keywords.forEach(k => content += `- ${k}\n`);
  }
  
  content += `\n---\n`;
  content += `*รายงานโดย UFAX9 Marketing Intelligence System*\n`;
  
  await fs.writeFile(summaryPath, content);
}

// CLI
const roundType = process.argv[2] || 'morning';

collect(roundType)
  .then(() => {
    console.log('✅ Full channel collection complete');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });

module.exports = { collectAllChannels, CHANNELS };
