import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import SpriteText from 'three-spritetext';
import * as THREE from 'three';
import './App.css';

// Simple 2D fallback component for mobile
function SimpleGraphFallback({ nodes, links, colors }) {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#0f0',
      fontFamily: 'monospace',
      padding: '20px'
    }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '20px' }}>🧠 AGENT BRAIN NETWORK</div>
      <div style={{ fontSize: '1rem', color: '#888', marginBottom: '30px', textAlign: 'center' }}>
        3D visualization requires desktop browser<br/>
        Showing simplified view:
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px',
        maxWidth: '400px',
        width: '100%'
      }}>
        {Object.entries(
          nodes.reduce((acc, n) => {
            acc[n.category] = (acc[n.category] || 0) + 1;
            return acc;
          }, {})
        ).map(([cat, count]) => (
          <div key={cat} style={{
            background: 'rgba(0,255,0,0.1)',
            border: '1px solid #0f0',
            borderRadius: '8px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{count}</div>
            <div style={{ fontSize: '0.8rem', color: '#888' }}>{cat}</div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '30px', fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
        Total: {nodes.length} nodes • {links.length} connections<br/>
        <a href="https://agent-brain-dashboard.vercel.app" style={{ color: '#0f0' }} target="_blank">
          Open on desktop for full 3D experience →
        </a>
      </div>
    </div>
  );
}

const gData = {
  nodes: [
    { id: 'SUPERVISOR', group: 0, label: 'SUPERVISOR', desc: 'Master Orchestrator - Controls all agents', val: 60, category: 'CORE' },
    { id: 'MEMORY', group: 0, label: 'Vector Memory', desc: 'RAG System - Long-term context storage', val: 35, category: 'CORE' },
    { id: 'GATEWAY', group: 0, label: 'API Gateway', desc: 'External communications hub', val: 35, category: 'CORE' },
    { id: 'IDENTITY', group: 0, label: 'PAPACLAW Identity', desc: 'AI Executive Assistant persona', val: 30, category: 'CORE' },
    { id: 'APEX', group: 1, label: 'APEX (CEO)', desc: 'Chief Executive - Strategy & big picture decisions', val: 40, category: 'AGENTS' },
    { id: 'PULSE', group: 1, label: 'PULSE (CMO)', desc: 'Chief Marketing - Growth, viral, trends', val: 40, category: 'AGENTS' },
    { id: 'STAT', group: 1, label: 'STAT (CAO)', desc: 'Chief Analyst - Football & Analytics', val: 40, category: 'AGENTS' },
    { id: 'LEDGER', group: 1, label: 'LEDGER (CFO)', desc: 'Chief Financial - ROI & cashflow', val: 40, category: 'AGENTS' },
    { id: 'AURA', group: 1, label: 'AURA (CSO)', desc: 'Chief Customer Success - Retention & LTV', val: 40, category: 'AGENTS' },
    { id: 'NEXUS', group: 1, label: 'NEXUS (COO)', desc: 'Chief Operations - Automation & Scraping', val: 40, category: 'AGENTS' },
    { id: 'CIPHER', group: 1, label: 'CIPHER (CIO)', desc: 'Chief Intelligence - Competitor spy', val: 40, category: 'AGENTS' },
    { id: 'SYNC', group: 1, label: 'SYNC (CHRO)', desc: 'Chief HR - Team & KPI management', val: 40, category: 'AGENTS' },
    { id: 'claude-opus', group: 2, label: 'Claude 3 Opus', desc: 'Deep reasoning & strategy', val: 25, category: 'MODELS' },
    { id: 'claude-sonnet', group: 2, label: 'Claude 3.5 Sonnet', desc: 'Coding & complex logic', val: 25, category: 'MODELS' },
    { id: 'gemini-pro', group: 2, label: 'Gemini 3 Pro', desc: 'High context analysis', val: 25, category: 'MODELS' },
    { id: 'gpt-4o', group: 2, label: 'GPT-4o', desc: 'Versatile execution', val: 25, category: 'MODELS' },
    { id: 'gpt-4o-mini', group: 2, label: 'GPT-4o Mini', desc: 'Fast, cheap tasks', val: 20, category: 'MODELS' },
    { id: 'o1-preview', group: 2, label: 'OpenAI o1', desc: 'Math & science reasoning', val: 25, category: 'MODELS' },
    { id: 'o3-mini', group: 2, label: 'OpenAI o3-mini', desc: 'Quick reasoning', val: 20, category: 'MODELS' },
    { id: 'kimi-k2', group: 2, label: 'Kimi K2.5', desc: 'Long context & coding', val: 22, category: 'MODELS' },
    { id: 'minimax-m2', group: 2, label: 'MiniMax M2.5', desc: 'Multilingual tasks', val: 22, category: 'MODELS' },
    { id: 'zai-glm4', group: 2, label: 'Zai GLM-4.7', desc: 'Chinese language tasks', val: 22, category: 'MODELS' },
    { id: 'know-business', group: 3, label: 'Business Strategy', desc: 'Strategic planning & execution', val: 15, category: 'KNOWLEDGE' },
    { id: 'know-marketing', group: 3, label: 'Marketing & SEO', desc: 'Growth hacking & optimization', val: 15, category: 'KNOWLEDGE' },
    { id: 'know-finance', group: 3, label: 'Finance & ROI', desc: 'Cashflow & investment analysis', val: 15, category: 'KNOWLEDGE' },
    { id: 'know-tech', group: 3, label: 'Technology', desc: 'System architecture & code', val: 15, category: 'KNOWLEDGE' },
    { id: 'know-data', group: 3, label: 'Data Analytics', desc: 'Deep data analysis', val: 15, category: 'KNOWLEDGE' },
    { id: 'know-hr', group: 3, label: 'HR & Team Mgmt', desc: 'KPI, OKR, team structures', val: 15, category: 'KNOWLEDGE' },
    { id: 'know-risk', group: 3, label: 'Risk Assessment', desc: 'Opportunity & threat evaluation', val: 15, category: 'KNOWLEDGE' },
    { id: 'skill-read', group: 4, label: 'File Read', desc: 'Read files & documents', val: 12, category: 'SKILLS' },
    { id: 'skill-write', group: 4, label: 'File Write', desc: 'Create & edit files', val: 12, category: 'SKILLS' },
    { id: 'skill-edit', group: 4, label: 'File Edit', desc: 'Surgical text replacement', val: 12, category: 'SKILLS' },
    { id: 'skill-exec', group: 4, label: 'Shell Exec', desc: 'Run bash commands', val: 12, category: 'SKILLS' },
    { id: 'skill-web-search', group: 4, label: 'Web Search', desc: 'Brave Search API', val: 12, category: 'SKILLS' },
    { id: 'skill-web-fetch', group: 4, label: 'Web Fetch', desc: 'Extract webpage content', val: 12, category: 'SKILLS' },
    { id: 'skill-browser', group: 4, label: 'Browser Ctrl', desc: 'Puppeteer automation', val: 12, category: 'SKILLS' },
    { id: 'skill-canvas', group: 4, label: 'Canvas', desc: 'UI rendering & snapshots', val: 12, category: 'SKILLS' },
    { id: 'skill-telegram', group: 4, label: 'Telegram API', desc: 'Messaging & notifications', val: 12, category: 'SKILLS' },
    { id: 'skill-discord', group: 4, label: 'Discord', desc: 'Server management', val: 12, category: 'SKILLS' },
    { id: 'skill-slack', group: 4, label: 'Slack', desc: 'Workspace integration', val: 12, category: 'SKILLS' },
    { id: 'skill-imessage', group: 4, label: 'iMessage', desc: 'Apple messaging', val: 12, category: 'SKILLS' },
    { id: 'skill-clawhub', group: 4, label: 'ClawHub', desc: 'Skill marketplace', val: 12, category: 'SKILLS' },
    { id: 'skill-healthcheck', group: 4, label: 'Healthcheck', desc: 'System security audit', val: 12, category: 'SKILLS' },
    { id: 'skill-gemini', group: 4, label: 'Gemini CLI', desc: 'One-shot Q&A', val: 12, category: 'SKILLS' },
    { id: 'skill-creator', group: 4, label: 'Skill Creator', desc: 'Build new skills', val: 12, category: 'SKILLS' },
    { id: 'skill-tmux', group: 4, label: 'Tmux Control', desc: 'Terminal sessions', val: 12, category: 'SKILLS' },
    { id: 'skill-weather', group: 4, label: 'Weather', desc: 'Forecast data', val: 12, category: 'SKILLS' },
    { id: 'skill-github', group: 4, label: 'GitHub', desc: 'Repo management', val: 12, category: 'SKILLS' },
    { id: 'skill-cron', group: 4, label: 'Cron Jobs', desc: 'Scheduled tasks', val: 12, category: 'SKILLS' },
    { id: 'skill-memory-search', group: 4, label: 'Memory Search', desc: 'Semantic recall', val: 12, category: 'SKILLS' },
    { id: 'skill-subagents', group: 4, label: 'Sub-Agents', desc: 'Spawn isolated sessions', val: 12, category: 'SKILLS' },
    { id: 'skill-tts', group: 4, label: 'TTS', desc: 'Text-to-speech', val: 12, category: 'SKILLS' },
    { id: 'skill-canvas-render', group: 4, label: 'Canvas Render', desc: 'Visual output', val: 12, category: 'SKILLS' },
    { id: 'skill-spotify', group: 4, label: 'Spotify', desc: 'Music control', val: 12, category: 'SKILLS' },
    { id: 'skill-notion', group: 4, label: 'Notion', desc: 'Notes & docs', val: 12, category: 'SKILLS' },
    { id: 'skill-obsidian', group: 4, label: 'Obsidian', desc: 'Knowledge base', val: 12, category: 'SKILLS' },
    { id: 'skill-tiktok-ads', group: 4, label: 'TikTok Ads', desc: 'Ad campaign API', val: 12, category: 'SKILLS' },
    { id: 'skill-meta-ads', group: 4, label: 'Meta Ads', desc: 'FB/IG campaigns', val: 12, category: 'SKILLS' },
    { id: 'skill-twitter', group: 4, label: 'Twitter/X API', desc: 'Social automation', val: 12, category: 'SKILLS' },
    { id: 'skill-viral', group: 4, label: 'Viral Analysis', desc: 'Trend detection', val: 12, category: 'SKILLS' },
    { id: 'skill-football', group: 4, label: 'Football Analyst', desc: 'Thai football analysis', val: 12, category: 'SKILLS' },
    { id: 'skill-ga4', group: 4, label: 'Google Analytics', desc: 'Traffic analysis', val: 12, category: 'SKILLS' },
    { id: 'skill-sheets', group: 4, label: 'Google Sheets', desc: 'Spreadsheet ops', val: 12, category: 'SKILLS' },
    { id: 'skill-stripe', group: 4, label: 'Stripe API', desc: 'Payment processing', val: 12, category: 'SKILLS' },
    { id: 'skill-openai-img', group: 4, label: 'OpenAI Image', desc: 'DALL-E generation', val: 12, category: 'SKILLS' },
    { id: 'skill-whisper', group: 4, label: 'Whisper', desc: 'Speech-to-text', val: 12, category: 'SKILLS' },
    { id: 'skill-fal', group: 4, label: 'FAL.ai', desc: 'Flux/SDXL images', val: 12, category: 'SKILLS' },
    { id: 'skill-deep-research', group: 4, label: 'Deep Research', desc: 'In-depth analysis', val: 12, category: 'SKILLS' },
    { id: 'skill-market-research', group: 4, label: 'Market Research', desc: 'Competitor analysis', val: 12, category: 'SKILLS' },
    { id: 'skill-parallel-research', group: 4, label: 'Parallel Research', desc: 'Concurrent data gathering', val: 12, category: 'SKILLS' },
    { id: 'skill-elite-memory', group: 4, label: 'Elite Memory', desc: 'Advanced context retention', val: 12, category: 'SKILLS' },
    { id: 'mem-core', group: 4, label: 'MEMORY.md', desc: 'Long-term curated memory', val: 15, category: 'MEMORY' },
    { id: 'mem-soul', group: 4, label: 'SOUL.md', desc: 'Agent identity & vibe', val: 15, category: 'MEMORY' },
    { id: 'mem-user', group: 4, label: 'USER.md', desc: 'Nathan preferences', val: 15, category: 'MEMORY' },
    { id: 'mem-agents', group: 4, label: 'AGENTS.md', desc: 'Executive team docs', val: 15, category: 'MEMORY' },
    { id: 'mem-tools', group: 4, label: 'TOOLS.md', desc: 'Tool configurations', val: 15, category: 'MEMORY' },
    { id: 'mem-daily', group: 4, label: 'Daily Logs', desc: 'YYYY-MM-DD history', val: 15, category: 'MEMORY' },
    { id: 'zoho-crm', group: 4, label: 'Zoho CRM', desc: 'Customer relationship', val: 12, category: 'TOOLS' },
    { id: 'hubspot', group: 4, label: 'HubSpot', desc: 'Marketing automation', val: 12, category: 'TOOLS' },
    { id: 'activecampaign', group: 4, label: 'ActiveCampaign', desc: 'Email automation', val: 12, category: 'TOOLS' },
    { id: 'todoist', group: 4, label: 'Todoist', desc: 'Task management', val: 12, category: 'TOOLS' },
    { id: 'gcal', group: 4, label: 'Google Calendar', desc: 'Schedule management', val: 12, category: 'TOOLS' },
    { id: 'football-api', group: 4, label: 'Football Data API', desc: 'Live scores & fixtures', val: 12, category: 'TOOLS' },
    { id: 'sub-seo', group: 6, label: 'SEO Specialist', desc: 'Technical SEO & content optimization', val: 18, category: 'SUB-AGENTS' },
    { id: 'sub-content', group: 6, label: 'Content Writer', desc: 'Blog posts & copywriting', val: 18, category: 'SUB-AGENTS' },
    { id: 'sub-ads', group: 6, label: 'Ads Manager', desc: 'PPC & paid media', val: 18, category: 'SUB-AGENTS' },
    { id: 'sub-analytics', group: 6, label: 'Data Analyst', desc: 'Reporting & insights', val: 18, category: 'SUB-AGENTS' },
    { id: 'sub-scraper', group: 6, label: 'Web Scraper', desc: 'Data extraction bots', val: 18, category: 'SUB-AGENTS' },
    { id: 'sub-research', group: 6, label: 'Researcher', desc: 'Market & competitor intel', val: 18, category: 'SUB-AGENTS' },
    { id: 'sub-coder', group: 6, label: 'Code Developer', desc: 'Scripts & automation', val: 18, category: 'SUB-AGENTS' },
    { id: 'sub-design', group: 6, label: 'UI Designer', desc: 'Visual design & mockups', val: 18, category: 'SUB-AGENTS' },
    { id: 'sub-video', group: 6, label: 'Video Editor', desc: 'Content production', val: 18, category: 'SUB-AGENTS' },
    { id: 'sub-social', group: 6, label: 'Social Media', desc: 'Community management', val: 18, category: 'SUB-AGENTS' },
    { id: 'sub-email', group: 6, label: 'Email Marketer', desc: 'Campaigns & automation', val: 18, category: 'SUB-AGENTS' },
    { id: 'sub-affiliate', group: 6, label: 'Affiliate Mgr', desc: 'Partner programs', val: 18, category: 'SUB-AGENTS' },
    { id: 'sub-vip', group: 6, label: 'VIP Handler', desc: 'High-value customers', val: 18, category: 'SUB-AGENTS' },
    { id: 'sub-fraud', group: 6, label: 'Fraud Detector', desc: 'Risk & security', val: 18, category: 'SUB-AGENTS' },
    { id: 'sub-support', group: 6, label: 'Support Agent', desc: 'Customer service', val: 18, category: 'SUB-AGENTS' },
    { id: 'th-market', group: 7, label: 'Thailand Market', desc: '70M pop, $15-20B gambling market', val: 20, category: 'REGIONAL' },
    { id: 'th-football', group: 7, label: 'Thai Football', desc: 'Premier League, Thai League betting', val: 18, category: 'REGIONAL' },
    { id: 'th-baccarat', group: 7, label: 'Thai Baccarat', desc: 'Most popular casino game', val: 18, category: 'REGIONAL' },
    { id: 'th-slots', group: 7, label: 'Thai Slots', desc: 'High engagement 18-35 demo', val: 18, category: 'REGIONAL' },
    { id: 'th-telegram', group: 7, label: 'Thai Telegram', desc: 'Primary gambling channel', val: 18, category: 'REGIONAL' },
    { id: 'th-line', group: 7, label: 'Thai LINE', desc: 'Official & group chats', val: 18, category: 'REGIONAL' },
    { id: 'th-tiktok', group: 7, label: 'Thai TikTok', desc: 'Prediction accounts funnel', val: 18, category: 'REGIONAL' },
    { id: 'th-kol', group: 7, label: 'Thai KOLs', desc: 'Sports commentators, hot girls', val: 18, category: 'REGIONAL' },
    { id: 'th-payment', group: 7, label: 'Thai Payments', desc: 'Bank transfer, TrueMoney', val: 18, category: 'REGIONAL' },
    { id: 'th-law', group: 7, label: 'Thai Gambling Law', desc: 'Gambling Act 2478', val: 16, category: 'REGIONAL' },
    { id: 'th-ufabet', group: 7, label: 'UFABET Network', desc: 'Agent-heavy model', val: 18, category: 'REGIONAL' },
    { id: 'th-cpa', group: 7, label: 'Thai CPA', desc: '800-2,500 THB per FTD', val: 16, category: 'REGIONAL' },
    { id: 'vn-market', group: 7, label: 'Vietnam Market', desc: '100M pop, VPN heavy usage', val: 20, category: 'REGIONAL' },
    { id: 'vn-daga', group: 7, label: 'Vietnam Đá Gà', desc: 'Cockfighting betting', val: 18, category: 'REGIONAL' },
    { id: 'vn-lottery', group: 7, label: 'Vietnam Lottery', desc: 'Xổ số Miền Bắc/Trung/Nam', val: 18, category: 'REGIONAL' },
    { id: 'vn-momo', group: 7, label: 'MoMo Wallet', desc: 'Primary e-wallet', val: 18, category: 'REGIONAL' },
    { id: 'vn-zalopay', group: 7, label: 'ZaloPay', desc: 'Secondary payment', val: 18, category: 'REGIONAL' },
    { id: 'vn-tiktok', group: 7, label: 'Vietnam TikTok', desc: 'KOL marketing 2M-10M/post', val: 18, category: 'REGIONAL' },
    { id: 'vn-188bet', group: 7, label: '188BET VN', desc: 'Strong Vietnam presence', val: 18, category: 'REGIONAL' },
    { id: 'vn-cmd368', group: 7, label: 'CMD368', desc: 'Vietnam focused', val: 18, category: 'REGIONAL' },
    { id: 'vn-cpa', group: 7, label: 'Vietnam CPA', desc: '500K-1.5M VND per FTD', val: 16, category: 'REGIONAL' },
    { id: 'vn-crypto', group: 7, label: 'VN Crypto Bridge', desc: 'USDT payment rails', val: 18, category: 'REGIONAL' },
    { id: 'id-market', group: 7, label: 'Indonesia Market', desc: '275M pop, Muslim majority', val: 20, category: 'REGIONAL' },
    { id: 'id-bandar', group: 7, label: 'Bandar Network', desc: 'Agent/broker system', val: 18, category: 'REGIONAL' },
    { id: 'id-crypto', group: 7, label: 'ID Crypto Only', desc: 'Avoid banking detection', val: 18, category: 'REGIONAL' },
    { id: 'id-whatsapp', group: 7, label: 'ID WhatsApp', desc: 'Community groups', val: 18, category: 'REGIONAL' },
    { id: 'id-facebook', group: 7, label: 'ID Facebook', desc: 'Groups & livestreams', val: 18, category: 'REGIONAL' },
    { id: 'id-sbobet', group: 7, label: 'SBOBET Indo', desc: 'Asian handicap leader', val: 18, category: 'REGIONAL' },
    { id: 'id-lang', group: 7, label: 'ID Language', desc: 'Bahasa Indonesia support', val: 16, category: 'REGIONAL' },
    { id: 'id-ramadan', group: 7, label: 'Ramadan Shift', desc: 'Evening post-Iftar peak', val: 16, category: 'REGIONAL' },
    { id: 'id-cpa', group: 7, label: 'Indonesia CPA', desc: '200K-800K IDR per FTD', val: 16, category: 'REGIONAL' },
    { id: 'id-vpn', group: 7, label: 'ID VPN Usage', desc: 'International sites access', val: 16, category: 'REGIONAL' },
    { id: 'cn-market', group: 7, label: 'China Shadow', desc: 'VIP revenue driver', val: 20, category: 'REGIONAL' },
    { id: 'cn-macau', group: 7, label: 'Macau Gateway', desc: 'Legal gambling hub', val: 18, category: 'REGIONAL' },
    { id: 'cn-flying', group: 7, label: 'Flying Money', desc: '飞钱 underground banking', val: 18, category: 'REGIONAL' },
    { id: 'cn-wechat', group: 7, label: 'WeChat OS', desc: 'Overseas version channels', val: 18, category: 'REGIONAL' },
    { id: 'cn-telegram', group: 7, label: 'CN Telegram', desc: 'Cross-border groups', val: 18, category: 'REGIONAL' },
    { id: 'cn-cambodia', group: 7, label: 'Cambodia Casinos', desc: 'Border operations', val: 18, category: 'REGIONAL' },
    { id: 'cn-philippines', group: 7, label: 'PH POGO', desc: 'Philippine offshore gaming', val: 18, category: 'REGIONAL' },
    { id: 'cn-vip', group: 7, label: 'Chinese VIPs', desc: 'High-roller segment', val: 18, category: 'REGIONAL' },
    { id: 'cn-crackdown', group: 7, label: 'CN Crackdown', desc: '2020-2025 policy', val: 16, category: 'REGIONAL' },
    { id: 'cn-junket', group: 7, label: 'Junket Agents', desc: 'VIP recruitment', val: 18, category: 'REGIONAL' },
    { id: 'tool-keitaro', group: 8, label: 'Keitaro', desc: 'Cloaking & tracking', val: 16, category: 'GREY-TOOLS' },
    { id: 'tool-binom', group: 8, label: 'Binom', desc: 'Self-hosted tracker', val: 16, category: 'GREY-TOOLS' },
    { id: 'tool-voluum', group: 8, label: 'Voluum', desc: 'Enterprise tracking', val: 16, category: 'GREY-TOOLS' },
    { id: 'tool-adspower', group: 8, label: 'AdsPower', desc: 'Anti-detect browser', val: 16, category: 'GREY-TOOLS' },
    { id: 'tool-multilogin', group: 8, label: 'Multilogin', desc: 'Profile isolation', val: 16, category: 'GREY-TOOLS' },
    { id: 'tool-camoufox', group: 8, label: 'Camoufox', desc: 'Undetectable Firefox', val: 16, category: 'GREY-TOOLS' },
    { id: 'tool-nodriver', group: 8, label: 'Nodriver', desc: 'WebDriver-free Chrome', val: 16, category: 'GREY-TOOLS' },
    { id: 'tool-scrapebox', group: 8, label: 'ScrapeBox', desc: 'SEO automation', val: 16, category: 'GREY-TOOLS' },
    { id: 'tool-gsa', group: 8, label: 'GSA SER', desc: 'Link building', val: 16, category: 'GREY-TOOLS' },
    { id: 'tool-ahrefs', group: 8, label: 'Ahrefs', desc: 'SEO intelligence', val: 16, category: 'GREY-TOOLS' },
    { id: 'tool-semrush', group: 8, label: 'SEMrush', desc: 'Competitor analysis', val: 16, category: 'GREY-TOOLS' },
    { id: 'tool-spyfu', group: 8, label: 'SpyFu', desc: 'PPC research', val: 16, category: 'GREY-TOOLS' },
    { id: 'tool-similarweb', group: 8, label: 'SimilarWeb', desc: 'Traffic analysis', val: 16, category: 'GREY-TOOLS' },
    { id: 'tool-builtwith', group: 8, label: 'BuiltWith', desc: 'Tech stack detection', val: 16, category: 'GREY-TOOLS' },
    { id: 'tool-wayback', group: 8, label: 'Wayback', desc: 'Historical data', val: 16, category: 'GREY-TOOLS' },
    { id: 'traf-pop', group: 9, label: 'Pop Traffic', desc: 'Adsterra, PropellerAds', val: 16, category: 'TRAFFIC' },
    { id: 'traf-push', group: 9, label: 'Push Ads', desc: 'RichAds, DaoPush', val: 16, category: 'TRAFFIC' },
    { id: 'traf-native', group: 9, label: 'Native Ads', desc: 'Taboola, Outbrain', val: 16, category: 'TRAFFIC' },
    { id: 'traf-adult', group: 9, label: 'Adult Traffic', desc: 'ExoClick, TrafficJunky', val: 16, category: 'TRAFFIC' },
    { id: 'traf-ppc', group: 9, label: 'PPC Arbitrage', desc: 'Bing, cheap clicks', val: 16, category: 'TRAFFIC' },
    { id: 'traf-pbn', group: 9, label: 'PBN Network', desc: 'Private blog network', val: 16, category: 'TRAFFIC' },
    { id: 'traf-parasite', group: 9, label: 'Parasite SEO', desc: 'Medium, LinkedIn', val: 16, category: 'TRAFFIC' },
    { id: 'traf-expired', group: 9, label: 'Expired Domains', desc: '301 redirect strategy', val: 16, category: 'TRAFFIC' },
    { id: 'traf-social', group: 9, label: 'Social Funnel', desc: 'FB groups, TikTok', val: 16, category: 'TRAFFIC' },
    { id: 'traf-telegram', group: 9, label: 'Telegram Funnel', desc: 'Free/VIP channels', val: 16, category: 'TRAFFIC' },
    { id: 'traf-kol', group: 9, label: 'KOL Network', desc: 'Influencer partnerships', val: 16, category: 'TRAFFIC' },
    { id: 'traf-sms', group: 9, label: 'SMS Blasts', desc: 'Text message marketing', val: 16, category: 'TRAFFIC' },
    { id: 'pay-usdt', group: 10, label: 'USDT TRC20', desc: 'Primary crypto rail', val: 16, category: 'PAYMENTS' },
    { id: 'pay-btc', group: 10, label: 'Bitcoin', desc: 'Store of value', val: 16, category: 'PAYMENTS' },
    { id: 'pay-eth', group: 10, label: 'Ethereum', desc: 'Smart contracts', val: 16, category: 'PAYMENTS' },
    { id: 'pay-truemoney', group: 10, label: 'TrueMoney', desc: 'Thai e-wallet', val: 16, category: 'PAYMENTS' },
    { id: 'pay-promptpay', group: 10, label: 'PromptPay', desc: 'Thai bank transfer', val: 16, category: 'PAYMENTS' },
    { id: 'pay-momo', group: 10, label: 'MoMo VN', desc: 'Vietnam e-wallet', val: 16, category: 'PAYMENTS' },
    { id: 'pay-zalopay', group: 10, label: 'ZaloPay VN', desc: 'Vietnam payment', val: 16, category: 'PAYMENTS' },
    { id: 'pay-2c2p', group: 10, label: '2C2P', desc: 'SE Asia gateway', val: 16, category: 'PAYMENTS' },
    { id: 'pay-vnpay', group: 10, label: 'VNPay', desc: 'Vietnam gateway', val: 16, category: 'PAYMENTS' },
    { id: 'pay-xendit', group: 10, label: 'Xendit', desc: 'Indonesia gateway', val: 16, category: 'PAYMENTS' },
    ...Array.from({ length: 53 }, (_, i) => ({ id: `apex_chunk_${i}`, group: 5, label: `Apex Chunk ${i}`, desc: 'Knowledge chunk from Apex-Knowledge.md', val: 6, category: 'VECTOR' })),
    ...Array.from({ length: 30 }, (_, i) => ({ id: `aura_chunk_${i}`, group: 5, label: `Aura Chunk ${i}`, desc: 'Knowledge chunk from Aura-Knowledge.md', val: 6, category: 'VECTOR' })),
    ...Array.from({ length: 23 }, (_, i) => ({ id: `cipher_chunk_${i}`, group: 5, label: `Cipher Chunk ${i}`, desc: 'Knowledge chunk from Cipher-Knowledge.md', val: 6, category: 'VECTOR' })),
    ...Array.from({ length: 39 }, (_, i) => ({ id: `ledger_chunk_${i}`, group: 5, label: `Ledger Chunk ${i}`, desc: 'Knowledge chunk from Ledger-Knowledge.md', val: 6, category: 'VECTOR' })),
    ...Array.from({ length: 78 }, (_, i) => ({ id: `lotto-oracle_chunk_${i}`, group: 5, label: `Lotto Chunk ${i}`, desc: 'Knowledge chunk from Lotto-Oracle.md', val: 6, category: 'VECTOR' })),
    ...Array.from({ length: 20 }, (_, i) => ({ id: `nexus_chunk_${i}`, group: 5, label: `Nexus Chunk ${i}`, desc: 'Knowledge chunk from Nexus-Knowledge.md', val: 6, category: 'VECTOR' })),
    ...Array.from({ length: 24 }, (_, i) => ({ id: `stat_chunk_${i}`, group: 5, label: `Stat Chunk ${i}`, desc: 'Knowledge chunk from Stat-Knowledge.md', val: 6, category: 'VECTOR' })),
    ...Array.from({ length: 19 }, (_, i) => ({ id: `sync_chunk_${i}`, group: 5, label: `Sync Chunk ${i}`, desc: 'Knowledge chunk from Sync-Knowledge.md', val: 6, category: 'VECTOR' })),
  ],
  links: [
    { source: 'SUPERVISOR', target: 'IDENTITY' },
    { source: 'SUPERVISOR', target: 'MEMORY' },
    { source: 'SUPERVISOR', target: 'GATEWAY' },
    { source: 'SUPERVISOR', target: 'APEX' },
    { source: 'SUPERVISOR', target: 'NEXUS' },
    { source: 'SUPERVISOR', target: 'CIPHER' },
    { source: 'APEX', target: 'PULSE' },
    { source: 'APEX', target: 'STAT' },
    { source: 'APEX', target: 'LEDGER' },
    { source: 'APEX', target: 'AURA' },
    { source: 'APEX', target: 'SYNC' },
    { source: 'APEX', target: 'claude-opus' },
    { source: 'NEXUS', target: 'claude-sonnet' },
    { source: 'STAT', target: 'gemini-pro' },
    { source: 'PULSE', target: 'gpt-4o' },
    { source: 'CIPHER', target: 'o1-preview' },
    { source: 'LEDGER', target: 'kimi-k2' },
    { source: 'AURA', target: 'minimax-m2' },
    { source: 'SUPERVISOR', target: 'zai-glm4' },
    { source: 'APEX', target: 'know-business' },
    { source: 'APEX', target: 'know-risk' },
    { source: 'PULSE', target: 'know-marketing' },
    { source: 'STAT', target: 'know-finance' },
    { source: 'STAT', target: 'know-data' },
    { source: 'NEXUS', target: 'know-tech' },
    { source: 'LEDGER', target: 'know-hr' },
    { source: 'SUPERVISOR', target: 'skill-read' },
    { source: 'SUPERVISOR', target: 'skill-write' },
    { source: 'SUPERVISOR', target: 'skill-edit' },
    { source: 'SUPERVISOR', target: 'skill-exec' },
    { source: 'SUPERVISOR', target: 'skill-web-search' },
    { source: 'SUPERVISOR', target: 'skill-web-fetch' },
    { source: 'SUPERVISOR', target: 'skill-memory-search' },
    { source: 'GATEWAY', target: 'skill-telegram' },
    { source: 'GATEWAY', target: 'skill-discord' },
    { source: 'GATEWAY', target: 'skill-slack' },
    { source: 'GATEWAY', target: 'skill-imessage' },
    { source: 'NEXUS', target: 'skill-clawhub' },
    { source: 'NEXUS', target: 'skill-creator' },
    { source: 'NEXUS', target: 'skill-tmux' },
    { source: 'NEXUS', target: 'skill-github' },
    { source: 'NEXUS', target: 'skill-browser' },
    { source: 'NEXUS', target: 'skill-canvas' },
    { source: 'NEXUS', target: 'skill-cron' },
    { source: 'CIPHER', target: 'skill-healthcheck' },
    { source: 'PULSE', target: 'skill-tiktok-ads' },
    { source: 'PULSE', target: 'skill-meta-ads' },
    { source: 'PULSE', target: 'skill-twitter' },
    { source: 'PULSE', target: 'skill-viral' },
    { source: 'PULSE', target: 'skill-market-research' },
    { source: 'STAT', target: 'skill-ga4' },
    { source: 'STAT', target: 'skill-sheets' },
    { source: 'STAT', target: 'skill-stripe' },
    { source: 'STAT', target: 'skill-football' },
    { source: 'STAT', target: 'skill-parallel-research' },
    { source: 'AURA', target: 'skill-openai-img' },
    { source: 'AURA', target: 'skill-fal' },
    { source: 'AURA', target: 'zoho-crm' },
    { source: 'AURA', target: 'hubspot' },
    { source: 'AURA', target: 'activecampaign' },
    { source: 'SYNC', target: 'skill-tts' },
    { source: 'SYNC', target: 'todoist' },
    { source: 'SYNC', target: 'gcal' },
    { source: 'APEX', target: 'skill-deep-research' },
    { source: 'MEMORY', target: 'skill-elite-memory' },
    { source: 'MEMORY', target: 'mem-core' },
    { source: 'MEMORY', target: 'mem-soul' },
    { source: 'MEMORY', target: 'mem-user' },
    { source: 'MEMORY', target: 'mem-agents' },
    { source: 'MEMORY', target: 'mem-tools' },
    { source: 'MEMORY', target: 'mem-daily' },
    { source: 'STAT', target: 'football-api' },
    { source: 'APEX', target: 'sub-seo' },
    { source: 'PULSE', target: 'sub-content' },
    { source: 'PULSE', target: 'sub-ads' },
    { source: 'STAT', target: 'sub-analytics' },
    { source: 'NEXUS', target: 'sub-scraper' },
    { source: 'STAT', target: 'sub-research' },
    { source: 'NEXUS', target: 'sub-coder' },
    { source: 'SYNC', target: 'sub-design' },
    { source: 'SYNC', target: 'sub-video' },
    { source: 'PULSE', target: 'sub-social' },
    { source: 'PULSE', target: 'sub-email' },
    { source: 'AURA', target: 'sub-affiliate' },
    { source: 'AURA', target: 'sub-vip' },
    { source: 'LEDGER', target: 'sub-fraud' },
    { source: 'AURA', target: 'sub-support' },
    { source: 'APEX', target: 'th-market' },
    { source: 'APEX', target: 'th-football' },
    { source: 'APEX', target: 'th-baccarat' },
    { source: 'APEX', target: 'th-slots' },
    { source: 'APEX', target: 'th-telegram' },
    { source: 'APEX', target: 'th-line' },
    { source: 'APEX', target: 'th-tiktok' },
    { source: 'APEX', target: 'th-kol' },
    { source: 'APEX', target: 'th-payment' },
    { source: 'APEX', target: 'th-law' },
    { source: 'APEX', target: 'th-ufabet' },
    { source: 'APEX', target: 'th-cpa' },
    { source: 'APEX', target: 'vn-market' },
    { source: 'APEX', target: 'vn-daga' },
    { source: 'APEX', target: 'vn-lottery' },
    { source: 'APEX', target: 'vn-momo' },
    { source: 'APEX', target: 'vn-zalopay' },
    { source: 'APEX', target: 'vn-tiktok' },
    { source: 'APEX', target: 'vn-188bet' },
    { source: 'APEX', target: 'vn-cmd368' },
    { source: 'APEX', target: 'vn-cpa' },
    { source: 'APEX', target: 'vn-crypto' },
    { source: 'APEX', target: 'id-market' },
    { source: 'APEX', target: 'id-bandar' },
    { source: 'APEX', target: 'id-crypto' },
    { source: 'APEX', target: 'id-whatsapp' },
    { source: 'APEX', target: 'id-facebook' },
    { source: 'APEX', target: 'id-sbobet' },
    { source: 'APEX', target: 'id-lang' },
    { source: 'APEX', target: 'id-ramadan' },
    { source: 'APEX', target: 'id-cpa' },
    { source: 'APEX', target: 'id-vpn' },
    { source: 'APEX', target: 'cn-market' },
    { source: 'APEX', target: 'cn-macau' },
    { source: 'APEX', target: 'cn-flying' },
    { source: 'APEX', target: 'cn-wechat' },
    { source: 'APEX', target: 'cn-telegram' },
    { source: 'APEX', target: 'cn-cambodia' },
    { source: 'APEX', target: 'cn-philippines' },
    { source: 'APEX', target: 'cn-vip' },
    { source: 'APEX', target: 'cn-crackdown' },
    { source: 'APEX', target: 'cn-junket' },
    { source: 'PULSE', target: 'tool-keitaro' },
    { source: 'PULSE', target: 'tool-binom' },
    { source: 'PULSE', target: 'tool-voluum' },
    { source: 'NEXUS', target: 'tool-adspower' },
    { source: 'NEXUS', target: 'tool-multilogin' },
    { source: 'NEXUS', target: 'tool-camoufox' },
    { source: 'NEXUS', target: 'tool-nodriver' },
    { source: 'CIPHER', target: 'tool-scrapebox' },
    { source: 'CIPHER', target: 'tool-gsa' },
    { source: 'CIPHER', target: 'tool-ahrefs' },
    { source: 'CIPHER', target: 'tool-semrush' },
    { source: 'CIPHER', target: 'tool-spyfu' },
    { source: 'CIPHER', target: 'tool-similarweb' },
    { source: 'CIPHER', target: 'tool-builtwith' },
    { source: 'CIPHER', target: 'tool-wayback' },
    { source: 'PULSE', target: 'traf-pop' },
    { source: 'PULSE', target: 'traf-push' },
    { source: 'PULSE', target: 'traf-native' },
    { source: 'PULSE', target: 'traf-adult' },
    { source: 'PULSE', target: 'traf-ppc' },
    { source: 'PULSE', target: 'traf-pbn' },
    { source: 'PULSE', target: 'traf-parasite' },
    { source: 'PULSE', target: 'traf-expired' },
    { source: 'PULSE', target: 'traf-social' },
    { source: 'PULSE', target: 'traf-telegram' },
    { source: 'PULSE', target: 'traf-kol' },
    { source: 'PULSE', target: 'traf-sms' },
    { source: 'LEDGER', target: 'pay-usdt' },
    { source: 'LEDGER', target: 'pay-btc' },
    { source: 'LEDGER', target: 'pay-eth' },
    { source: 'LEDGER', target: 'pay-truemoney' },
    { source: 'LEDGER', target: 'pay-promptpay' },
    { source: 'LEDGER', target: 'pay-momo' },
    { source: 'LEDGER', target: 'pay-zalopay' },
    { source: 'LEDGER', target: 'pay-2c2p' },
    { source: 'LEDGER', target: 'pay-vnpay' },
    { source: 'LEDGER', target: 'pay-xendit' },
  ],
};

const colors = {
  0: '#ffffff',
  1: '#ff0055',
  2: '#00ccff',
  3: '#aa66ff',
  4: '#66ffaa',
  5: '#ffaa00',
  6: '#ff66aa',
  7: '#66aaff',
  8: '#aa66aa',
  9: '#ffaa66',
  10: '#66ff66'
};

const categoryColors = {
  'CORE': '#ffffff',
  'AGENTS': '#ff0055',
  'MODELS': '#00ccff',
  'KNOWLEDGE': '#aa66ff',
  'SKILLS': '#66ffaa',
  'MEMORY': '#ffaa00',
  'TOOLS': '#ff66aa',
  'SUB-AGENTS': '#66aaff',
  'REGIONAL': '#aa66aa',
  'GREY-TOOLS': '#ffaa66',
  'TRAFFIC': '#66ff66',
  'PAYMENTS': '#ff6666',
  'VECTOR': '#6666ff'
};

// Generate high-density neural nodes
const generateNeuralNodes = (count = 150) => {
  const neuralNodes = [];
  const categories = ['NEURAL', 'SYNAPSE', 'NEURON', 'PATHWAY', 'IMPULSE'];
  
  for (let i = 0; i < count; i++) {
    neuralNodes.push({
      id: `neural_${i}`,
      group: Math.floor(Math.random() * 5) + 11,
      label: `${categories[Math.floor(Math.random() * categories.length)]}_${i}`,
      desc: `Neural pathway connection node`,
      val: Math.random() * 5 + 3,
      category: 'NEURAL'
    });
  }
  return neuralNodes;
};

// Generate neural connections
const generateNeuralLinks = (baseNodes, neuralNodes) => {
  const links = [];
  const coreNodes = baseNodes.filter(n => n.group <= 2);
  
  neuralNodes.forEach((node, i) => {
    // Connect to core nodes
    if (Math.random() > 0.6) {
      const target = coreNodes[Math.floor(Math.random() * coreNodes.length)];
      links.push({ source: node.id, target: target.id });
    }
    // Connect to other neural nodes
    if (i > 0 && Math.random() > 0.8) {
      const targetIndex = Math.floor(Math.random() * i);
      links.push({ source: node.id, target: neuralNodes[targetIndex].id });
    }
  });
  
  return links;
};

// Detect mobile device
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
};

// Check WebGL support
const checkWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
};
const ACTIVITY_TEMPLATES = [
  { agent: "NEXUS", actions: ["Running healthcheck", "Deploying update", "Monitoring logs", "Scaling resources"] },
  { agent: "PULSE", actions: ["Analyzing TikTok trends", "Checking viral content", "Updating ad bids", "Scanning hashtags"] },
  { agent: "MEMORY", actions: ["Indexing daily logs", "Compressing vectors", "Syncing to disk", "Optimizing RAG"] },
  { agent: "STAT", actions: ["Polling Google Sheets", "Calculating odds", "Updating football data", "Processing analytics"] },
  { agent: "APEX", actions: ["Generating report", "Reviewing strategy", "Allocating budget", "Checking KPIs"] },
  { agent: "CIPHER", actions: ["Scraping competitor", "Analyzing backlinks", "Monitoring mentions", "Tracking ranks"] },
  { agent: "SUPERVISOR", actions: ["Re-allocating tasks", "Balancing load", "Checking quotas", "Optimizing costs"] },
  { agent: "LEDGER", actions: ["Calculating ROI", "Processing payments", "Reconciling accounts", "Checking cashflow"] },
  { agent: "AURA", actions: ["Checking VIP status", "Processing tickets", "Updating CRM", "Analyzing LTV"] },
  { agent: "SYNC", actions: ["Syncing calendars", "Checking tasks", "Updating KPIs", "Managing team"] }
];

const generateRealtimeMetrics = () => ({
  tokensUsed: Math.floor(Math.random() * 1000000) + 500000,
  apiCalls: Math.floor(Math.random() * 5000) + 1000,
  activeSessions: Math.floor(Math.random() * 20) + 5,
  cpuUsage: Math.floor(Math.random() * 60) + 20,
  memoryUsage: Math.floor(Math.random() * 70) + 30,
  networkLatency: Math.floor(Math.random() * 50) + 10,
  lastUpdate: new Date().toLocaleTimeString()
});

const generateActivity = () => {
  const template = ACTIVITY_TEMPLATES[Math.floor(Math.random() * ACTIVITY_TEMPLATES.length)];
  const action = template.actions[Math.floor(Math.random() * template.actions.length)];
  return { agent: template.agent, action, timestamp: new Date() };
};

export default function App() {
  const fgRef = useRef();
  const [rotationSpeed, setRotationSpeed] = useState(0.5);
  const [isRotating, setIsRotating] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [nodeSize, setNodeSize] = useState(1);
  const [linkOpacity, setLinkOpacity] = useState(0.2);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [hoverNode, setHoverNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(window.innerWidth > 768);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulationPaused, setIsSimulationPaused] = useState(false);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [sphereMode, setSphereMode] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0.6);
  
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [renderError, setRenderError] = useState(null);
  
  // Check device capabilities on mount
  useEffect(() => {
    setIsMobileDevice(isMobile());
    setWebGLSupported(checkWebGL());
  }, []);

  // WebSocket connection for real-time data
  const { 
    isConnected, 
    metrics, 
    activity, 
    activityLog, 
    nodeStatuses,
    error 
  } = useWebSocket();
  
  // Use WebSocket activity or fallback to simulated
  const currentActivity = activity || { agent: 'SUPERVISOR', action: 'Initializing...', timestamp: new Date() };

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Loading progress simulation
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => setIsLoading(false), 500);
      }
      setLoadingProgress(Math.min(progress, 100));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Physics configuration - Brain structure with centripetal force
  useEffect(() => {
    if (!fgRef.current || isLoading) return;
    
    // Brain structure physics - centripetal force for neural clustering
    fgRef.current.d3Force('charge').strength(-80);
    fgRef.current.d3Force('center', null);
    fgRef.current.d3Force('x', null);
    fgRef.current.d3Force('y', null);
    fgRef.current.d3Force('z', null);
    
    // Strong center force for brain-like clustering
    fgRef.current.d3Force('center', fgRef.current.d3Force('center').strength(0.08));
    fgRef.current.d3Force('collide', fgRef.current.d3Force('collide')?.radius(d => d.val * 0.6).strength(0.8));
    
    // Brain structure settings
    fgRef.current.d3AlphaDecay(0.02);
    fgRef.current.d3VelocityDecay(0.4);
    fgRef.current.warmupTicks(100);
    fgRef.current.cooldownTicks(200);
    
    // Initial camera position
    setTimeout(() => {
      if (fgRef.current) {
        fgRef.current.cameraPosition({ x: 300, y: 150, z: 400 }, { x: 0, y: 0, z: 0 }, 2000);
      }
    }, 500);
  }, [isLoading]);

  // Smooth camera rotation
  useEffect(() => {
    if (!fgRef.current || isLoading || isSimulationPaused) return;
    
    let angle = 0;
    let animationId;
    
    const animate = () => {
      if (isRotating && !isSimulationPaused) {
        angle += 0.001 * rotationSpeed;
        const x = 250 * Math.sin(angle);
        const z = 250 * Math.cos(angle);
        fgRef.current.cameraPosition({ x, y: 50, z });
      }
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isRotating, rotationSpeed, isLoading, isSimulationPaused]);

  // Smooth node click handler with lerp
  const handleNodeClick = useCallback(node => {
    setSelectedNode(node);
    setIsSimulationPaused(true);
    setIsRotating(false);
    
    if (fgRef.current) {
      // Pause simulation
      fgRef.current.pauseAnimation();
      
      // Calculate target position
      const dist = 150;
      const targetPos = {
        x: node.x + dist,
        y: node.y + dist * 0.5,
        z: node.z + dist
      };
      
      // Smooth camera transition
      const duration = 1500;
      const startPos = fgRef.current.camera().position.clone();
      const startTime = Date.now();
      
      const animateCamera = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        
        const newX = startPos.x + (targetPos.x - startPos.x) * eased;
        const newY = startPos.y + (targetPos.y - startPos.y) * eased;
        const newZ = startPos.z + (targetPos.z - startPos.z) * eased;
        
        fgRef.current.cameraPosition({ x: newX, y: newY, z: newZ }, node);
        
        if (progress < 1) {
          requestAnimationFrame(animateCamera);
        } else {
          // Resume animation after transition
          setTimeout(() => {
            fgRef.current.resumeAnimation();
            setIsSimulationPaused(false);
          }, 100);
        }
      };
      
      requestAnimationFrame(animateCamera);
    }
  }, []);

  // Sphere mode effect - arrange nodes in spherical pattern
  useEffect(() => {
    if (!fgRef.current || isLoading) return;
    
    if (sphereMode) {
      // Apply spherical layout
      const nodes = graphData.nodes;
      const radius = 200;
      const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
      
      nodes.forEach((node, i) => {
        const y = 1 - (i / (nodes.length - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y) * radius;
        const theta = phi * i;
        
        node.x = radiusAtY * Math.cos(theta);
        node.y = y * radius;
        node.z = radiusAtY * Math.sin(theta);
      });
      
      fgRef.current.refresh();
    } else {
      // Reset to force-directed layout
      fgRef.current.d3ReheatSimulation();
    }
  }, [sphereMode, isLoading]);

  const safeGetGroup = (nodeId) => {
    const node = gData.nodes.find(n => n.id === nodeId);
    return node ? node.group : null;
  };

  const validIds = new Set(gData.nodes.map(n => n.id));
  const cleanLinks = gData.links.filter(l => {
    const s = typeof l.source === 'object' ? l.source.id : l.source;
    const t = typeof l.target === 'object' ? l.target.id : l.target;
    return validIds.has(s) && validIds.has(t);
  });
  
  // Add neural nodes for high density - reduce count on mobile
  const neuralCount = isMobileDevice ? 0 : 0; // Disable extra nodes for now
  const neuralNodes = useMemo(() => generateNeuralNodes(neuralCount), [neuralCount]);
  const neuralLinks = useMemo(() => generateNeuralLinks(gData.nodes, neuralNodes), [neuralNodes]);
  
  const allNodes = [...gData.nodes, ...neuralNodes];
  const allLinks = [...cleanLinks, ...neuralLinks];
  
  const safeGData = {
    nodes: allNodes.map((n, i) => ({
      ...n,
      // Pre-position nodes in clusters to reduce explosion
      x: Math.cos(i * 0.3) * (50 + (n.group || 0) * 25) + (Math.random() - 0.5) * 30,
      y: Math.sin(i * 0.3) * (50 + (n.group || 0) * 25) + (Math.random() - 0.5) * 30,
      z: (Math.random() - 0.5) * 50
    })),
    links: allLinks
  };

  const graphData = activeFilter === 'ALL' ? safeGData : {
    nodes: safeGData.nodes.filter(n => n.group === activeFilter),
    links: safeGData.links.filter(l => {
      const s = typeof l.source === 'object' ? l.source.group : safeGetGroup(l.source);
      const t = typeof l.target === 'object' ? l.target.group : safeGetGroup(l.target);
      return s === activeFilter || t === activeFilter;
    })
  };

  const nodesByCategory = gData.nodes.reduce((acc, node) => {
    const cat = node.category || 'OTHER';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(node);
    return acc;
  }, {});

  const toggleCategory = (cat) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const getQuotaPercent = (nodeId) => {
    if (nodeId === 'kimi-k2') return 85;
    if (nodeId === 'minimax-m2') return 5;
    if (nodeId === 'claude-sonnet') return 30;
    if (nodeId === 'gemini-pro') return 25;
    return Math.floor(Math.random() * 50 + 20);
  };

  const activeNode = hoverNode || selectedNode;

  // Legend items
  const legendItems = [
    { color: '#ffffff', label: 'CORE' },
    { color: '#ff0055', label: 'AGENTS' },
    { color: '#00ccff', label: 'MODELS' },
    { color: '#aa66ff', label: 'KNOWLEDGE' },
    { color: '#66ffaa', label: 'SKILLS' },
    { color: '#ffaa00', label: 'MEMORY' },
    { color: '#ff66aa', label: 'TOOLS' },
    { color: '#66aaff', label: 'SUB-AGENTS' },
    { color: '#aa66aa', label: 'REGIONAL' },
    { color: '#ffaa66', label: 'GREY-TOOLS' },
    { color: '#66ff66', label: 'TRAFFIC' },
    { color: '#ff6666', label: 'PAYMENTS' },
    { color: '#6666ff', label: 'VECTOR' }
  ];

  // Mobile fallback - show 2D summary immediately (skip loading)
  if (isMobileDevice) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#0f0',
        fontFamily: 'monospace',
        padding: '20px',
        boxSizing: 'border-box'
      }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '20px', textAlign: 'center' }}>🧠 AGENT BRAIN</div>
        <div style={{ fontSize: '1rem', color: '#888', marginBottom: '30px', textAlign: 'center' }}>
          Mobile View - 463 Nodes
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '15px',
          maxWidth: '400px',
          width: '100%'
        }}>
          <div style={{ background: 'rgba(0,255,0,0.1)', border: '1px solid #0f0', borderRadius: '8px', padding: '15px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>4</div>
            <div style={{ fontSize: '0.8rem', color: '#888' }}>CORE</div>
          </div>
          <div style={{ background: 'rgba(0,255,0,0.1)', border: '1px solid #0f0', borderRadius: '8px', padding: '15px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>8</div>
            <div style={{ fontSize: '0.8rem', color: '#888' }}>AGENTS</div>
          </div>
          <div style={{ background: 'rgba(0,255,0,0.1)', border: '1px solid #0f0', borderRadius: '8px', padding: '15px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>11</div>
            <div style={{ fontSize: '0.8rem', color: '#888' }}>MODELS</div>
          </div>
          <div style={{ background: 'rgba(0,255,0,0.1)', border: '1px solid #0f0', borderRadius: '8px', padding: '15px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>54</div>
            <div style={{ fontSize: '0.8rem', color: '#888' }}>SKILLS</div>
          </div>
        </div>
        <div style={{ marginTop: '30px', fontSize: '0.8rem', color: '#666', textAlign: 'center' }}>
          Use desktop for 3D visualization
        </div>
      </div>
    );
  }

  // Desktop only: Show loading screen
  if (isLoading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontFamily: 'monospace'
      }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#0f0' }}>
          LOADING BRAIN...
        </div>
        <div style={{
          width: '300px',
          height: '8px',
          background: '#222',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${loadingProgress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #0f0, #0ff)',
            transition: 'width 0.2s ease'
          }} />
        </div>
        <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#888' }}>
          {Math.round(loadingProgress)}%
        </div>
      </div>
    );
  }

  // WebGL not supported fallback - TEMP DISABLED
  // if (!webGLSupported) {
  //   return (fallback UI)
  // }

  return (
    <div className="app-container">
      {/* Legend */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.85)',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #333',
        zIndex: 100,
        maxWidth: '200px',
        maxHeight: '300px',
        overflowY: 'auto'
      }}>
        <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '10px', fontWeight: 'bold' }}>
          CATEGORIES
        </div>
        {legendItems.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: item.color }} />
            <span style={{ fontSize: '0.7rem', color: '#ccc' }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Side Menu Toggle */}
      <button 
        onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
        style={{
          position: 'fixed',
          left: isSideMenuOpen ? '320px' : '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1000,
          background: 'rgba(0,0,0,0.8)',
          border: '1px solid #444',
          color: '#fff',
          padding: '10px 15px',
          borderRadius: '0 8px 8px 0',
          cursor: 'pointer',
          fontSize: '1.2rem',
          transition: 'left 0.3s ease'
        }}
      >
        {isSideMenuOpen ? '◀' : '▶'}
      </button>

      {/* Side Menu Panel */}
      <div style={{
        position: 'fixed',
        left: isSideMenuOpen ? '0' : '-320px',
        top: '0',
        width: '320px',
        height: '100vh',
        background: 'rgba(0,0,0,0.98)',
        borderRight: '1px solid #333',
        zIndex: 999,
        overflow: 'hidden',
        transition: 'left 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '15px 20px', borderBottom: '1px solid #333', background: 'rgba(0,0,0,0.5)' }}>
          <h2 style={{ margin: 0, color: '#0f0', fontSize: '1.1rem' }}>📊 DATA VIEWER</h2>
          <p style={{ margin: '5px 0 0 0', color: '#888', fontSize: '0.75rem' }}>
            {gData.nodes.length} Nodes • {gData.links.length} Links
          </p>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '10px' }}>
          {/* Live Activity */}
          <div style={{ marginBottom: '15px', padding: '10px', background: 'rgba(0,255,100,0.05)', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ color: '#0f0', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '8px' }}>⚡ LIVE ACTIVITY</div>
            {activityLog.slice(0, 5).map((activity, idx) => (
              <div key={idx} style={{ fontSize: '0.7rem', color: idx === 0 ? '#fff' : '#888', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                <span><strong style={{ color: categoryColors[activity.agent] || '#0f0' }}>{activity.agent}</strong>: {activity.action}</span>
                <span style={{ fontSize: '0.6rem' }}>{new Date(activity.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>

          {Object.entries(nodesByCategory).map(([category, nodes]) => (
            <div key={category} style={{ marginBottom: '8px' }}>
              <button
                onClick={() => toggleCategory(category)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid #333',
                  borderRadius: '6px',
                  color: categoryColors[category] || '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{category}</span>
                <span style={{ color: '#888', fontSize: '0.75rem' }}>{nodes.length} ▼</span>
              </button>
              
              {expandedCategories[category] && (
                <div style={{ marginTop: '5px', paddingLeft: '10px' }}>
                  {nodes.map(node => (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      style={{
                        padding: '8px 10px',
                        marginBottom: '4px',
                        background: selectedNode?.id === node.id ? 'rgba(0,255,100,0.2)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${selectedNode?.id === node.id ? '#0f0' : '#222'}`,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        color: '#ccc'
                      }}
                    >
                      <div style={{ fontWeight: 'bold', color: '#fff' }}>{node.label}</div>
                      <div style={{ color: '#888', fontSize: '0.7rem', marginTop: '2px' }}>{node.desc.substring(0, 50)}...</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        marginLeft: isSideMenuOpen ? '320px' : '0', 
        width: isSideMenuOpen ? 'calc(100vw - 320px)' : '100vw',
        height: '100vh', 
        transition: 'margin-left 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Debug info */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(255,0,0,0.8)',
          color: '#fff',
          padding: '10px',
          zIndex: 9999,
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          <div>Nodes: {graphData?.nodes?.length || 0}</div>
          <div>Links: {graphData?.links?.length || 0}</div>
          <div>Width: {dimensions.width}</div>
          <div>Height: {dimensions.height}</div>
          <div>Mobile: {isMobileDevice ? 'Yes' : 'No'}</div>
          <div>WebGL: {webGLSupported ? 'Yes' : 'No'}</div>
        </div>

        {dimensions.width > 0 && dimensions.height > 0 && graphData.nodes.length > 0 ? (
        <ForceGraph3D
          ref={fgRef}
          graphData={graphData}
          warmupTicks={20}
          cooldownTicks={50}
          width={isSideMenuOpen ? dimensions.width - 320 : dimensions.width}
          height={dimensions.height}
          nodeRelSize={8}
          nodeColor={node => colors[node.group] || '#ffffff'}
          nodeVal={node => node.val || 10}
          nodeResolution={8}
          linkWidth={1}
          linkColor={() => 'rgba(100,200,255,0.5)'}
          linkDirectionalArrowLength={0}
          linkDirectionalParticles={0}
          onNodeClick={handleNodeClick}
          onNodeHover={setHoverNode}
          backgroundColor="#000000"
        />
        ) : (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#ff4444',
            fontSize: '1.5rem',
            textAlign: 'center'
          }}>
            ⚠️ Cannot render graph
            <div style={{ fontSize: '1rem', color: '#888', marginTop: '10px' }}>
              Dimensions: {dimensions.width}x{dimensions.height}<br/>
              Nodes: {graphData.nodes.length}
            </div>
          </div>
        )}
      </div>

      {/* HUD - Sci-Fi Interface */}
      <div style={{ position: 'fixed', top: 0, left: isSideMenuOpen ? '320px' : '0', right: 0, pointerEvents: 'none', zIndex: 50 }}>
        {/* Header - Sci-Fi Style */}
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(0,20,40,0.9), rgba(0,10,20,0.95))',
            padding: '15px 25px',
            borderRadius: '8px',
            border: '1px solid rgba(0,255,200,0.3)',
            boxShadow: '0 0 30px rgba(0,255,200,0.1), inset 0 0 20px rgba(0,255,200,0.05)'
          }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', letterSpacing: '2px', textShadow: '0 0 10px rgba(0,255,200,0.5)' }}>
              NEURAL<span style={{ color: '#00ffc8' }}>//</span>OS
            </div>
            <div style={{ fontSize: '0.7rem', color: '#00ffc8', marginTop: '8px', letterSpacing: '3px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '6px', height: '6px', background: '#00ff66', borderRadius: '50%', animation: 'pulse 1.5s infinite', boxShadow: '0 0 10px #00ff66' }}></span>
              ONLINE • {graphData.nodes.length} NEURAL NODES
            </div>
          </div>
        </div>

        {/* Live Activity Ticker - Marquee */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(0,0,0,0.85)',
          padding: '12px 16px',
          borderRadius: '12px',
          border: '1px solid rgba(0,255,100,0.4)',
          color: '#fff',
          fontSize: '0.75rem',
          zIndex: 100,
          pointerEvents: 'auto',
          maxWidth: '280px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ width: '10px', height: '10px', background: '#00ff66', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>
            <span style={{ color: '#0f0', fontWeight: 'bold' }}>LIVE</span>
            <span style={{ color: '#888', fontSize: '0.7rem' }}>{metrics.lastUpdate}</span>
          </div>
          
          {/* Marquee container */}
          <div style={{ overflow: 'hidden', width: '100%', marginBottom: '8px' }}>
            <div style={{
              whiteSpace: 'nowrap',
              animation: 'marquee 10s linear infinite',
              display: 'inline-block'
            }}>
              <span style={{ color: '#0f0', fontWeight: 'bold' }}>{currentActivity.agent}</span>
              <span style={{ color: '#fff', marginLeft: '8px' }}>: {currentActivity.action}</span>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.7rem' }}>
            <div style={{ color: '#888' }}>Tokens: <span style={{ color: '#0ff' }}>{metrics.tokensUsed.toLocaleString()}</span></div>
            <div style={{ color: '#888' }}>API: <span style={{ color: '#0ff' }}>{metrics.apiCalls.toLocaleString()}</span></div>
            <div style={{ color: '#888' }}>CPU: <span style={{ color: metrics.cpuUsage > 70 ? '#f44' : metrics.cpuUsage > 50 ? '#fa4' : '#4f4' }}>{metrics.cpuUsage}%</span></div>
            <div style={{ color: '#888' }}>Mem: <span style={{ color: metrics.memoryUsage > 80 ? '#f44' : metrics.memoryUsage > 60 ? '#fa4' : '#4f4' }}>{metrics.memoryUsage}%</span></div>
          </div>
        </div>

        {/* Controls Button */}
        <button 
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          style={{
            position: 'absolute',
            top: '150px',
            right: '20px',
            background: 'rgba(0,0,0,0.8)',
            border: '1px solid #444',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.75rem',
            pointerEvents: 'auto'
          }}
        >
          {isPanelOpen ? '✖ CLOSE' : '⚙ CONTROLS'}
        </button>

        {/* Controls Panel - FIXED overflow */}
        {isPanelOpen && (
          <div style={{
            position: 'absolute',
            top: '190px',
            right: '20px',
            background: 'rgba(0,0,0,0.9)',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #444',
            width: '250px',
            maxHeight: 'calc(100vh - 220px)',
            overflowY: 'auto',
            pointerEvents: 'auto',
            zIndex: 99
          }}>
            <h3 style={{ color: '#0f0', fontSize: '0.9rem', marginBottom: '10px' }}>CLUSTER FILTER</h3>
            
            {/* Grid layout for buttons */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '6px', 
              marginBottom: '20px' 
            }}>
              {[
                { label: 'ALL', filter: 'ALL', color: '#fff' },
                { label: 'CORE', filter: 0, color: colors[0] },
                { label: 'AGENTS', filter: 1, color: colors[1] },
                { label: 'MODELS', filter: 2, color: colors[2] },
                { label: 'KNOWLEDGE', filter: 3, color: colors[3] },
                { label: 'SKILLS', filter: 4, color: colors[4] },
              ].map(btn => (
                <button
                  key={btn.label}
                  onClick={() => setActiveFilter(btn.filter)}
                  style={{
                    background: activeFilter === btn.filter ? btn.color : 'transparent',
                    color: activeFilter === btn.filter ? '#000' : btn.color,
                    border: `1px solid ${btn.color}`,
                    padding: '6px 4px',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    cursor: 'pointer',
                    fontWeight: activeFilter === btn.filter ? 'bold' : 'normal'
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <h4 style={{ color: '#666', fontSize: '0.7rem', marginBottom: '8px' }}>CONTROLS</h4>
            
            {/* Sphere Mode Toggle */}
            <div style={{ marginBottom: '12px', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#aaa', fontSize: '0.75rem' }}>🎯 Sphere Mode</span>
                <button
                  onClick={() => setSphereMode(!sphereMode)}
                  style={{
                    background: sphereMode ? '#0f0' : 'transparent',
                    color: sphereMode ? '#000' : '#0f0',
                    border: '1px solid #0f0',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    cursor: 'pointer'
                  }}
                >
                  {sphereMode ? 'ON' : 'OFF'}
                </button>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#666' }}>
                {sphereMode ? 'Nodes arranged in 3D sphere' : 'Free-form graph layout'}
              </div>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <label style={{ color: '#aaa', fontSize: '0.75rem' }}>Node Size: {nodeSize.toFixed(1)}</label>
              <input type="range" min="0.5" max="3" step="0.1" value={nodeSize} onChange={e => setNodeSize(parseFloat(e.target.value))} style={{ width: '100%' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ color: '#aaa', fontSize: '0.75rem' }}>Rotation: {rotationSpeed.toFixed(1)}</label>
              <input type="range" min="0" max="2" step="0.1" value={rotationSpeed} onChange={e => setRotationSpeed(parseFloat(e.target.value))} style={{ width: '100%' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ color: '#aaa', fontSize: '0.75rem' }}>Link Opacity: {linkOpacity.toFixed(1)}</label>
              <input type="range" min="0" max="1" step="0.1" value={linkOpacity} onChange={e => setLinkOpacity(parseFloat(e.target.value))} style={{ width: '100%' }} />
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <label style={{ color: '#aaa', fontSize: '0.75rem' }}>Glow Intensity: {glowIntensity.toFixed(1)}</label>
              <input type="range" min="0" max="1" step="0.1" value={glowIntensity} onChange={e => setGlowIntensity(parseFloat(e.target.value))} style={{ width: '100%' }} />
            </div>
            
            <label style={{ color: '#aaa', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" checked={showLabels} onChange={e => setShowLabels(e.target.checked)} /> Show Labels
            </label>
          </div>
        )}

        {/* Node Detail Panel */}
        {activeNode && (
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            background: 'rgba(0,0,0,0.95)',
            backdropFilter: 'blur(10px)',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            borderLeft: `3px solid ${colors[activeNode.group]}`,
            maxWidth: '320px',
            color: '#fff',
            pointerEvents: 'auto'
          }}>
            <div style={{ color: colors[activeNode.group], fontSize: '0.7rem', letterSpacing: '2px', marginBottom: '5px' }}>
              {activeNode.group === 0 ? 'CORE SYSTEM' : activeNode.group === 1 ? 'EXECUTIVE AGENT' : activeNode.group === 2 ? 'AI MODEL' : activeNode.group === 3 ? 'KNOWLEDGE DOMAIN' : 'SKILL/TOOL'}
            </div>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '1.3rem' }}>{activeNode.label}</h2>
            <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '15px' }}>{activeNode.desc}</p>
            
            {nodeStatuses[activeNode.id] && (
              <div style={{ marginBottom: '15px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#888' }}>Status:</span>
                  <span style={{ fontSize: '0.75rem', color: nodeStatuses[activeNode.id].status === 'active' ? '#0f0' : '#fa0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: nodeStatuses[activeNode.id].status === 'active' ? '#0f0' : '#fa0', animation: nodeStatuses[activeNode.id].status === 'active' ? 'pulse 1s infinite' : 'none' }}></span>
                    {nodeStatuses[activeNode.id].status.toUpperCase()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#888' }}>Load:</span>
                  <div style={{ width: '100px', height: '6px', background: '#222', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${nodeStatuses[activeNode.id].load}%`, height: '100%', background: nodeStatuses[activeNode.id].load > 80 ? '#f44' : nodeStatuses[activeNode.id].load > 50 ? '#fa4' : '#4f4', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              </div>
            )}
            
            {activeNode.group === 2 && (
              <>
                <div style={{ fontSize: '0.65rem', color: '#888', marginBottom: '5px' }}>QUOTA STATUS</div>
                <div style={{ width: '100%', height: '6px', background: '#222', borderRadius: '3px', overflow: 'hidden', marginBottom: '15px' }}>
                  <div style={{ height: '100%', width: `${getQuotaPercent(activeNode.id)}%`, background: getQuotaPercent(activeNode.id) > 80 ? '#ef4444' : getQuotaPercent(activeNode.id) > 50 ? '#eab308' : '#22c55e' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.75rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '4px' }}>
                    <div style={{ color: '#888' }}>TOKENS</div>
                    <div>{Math.floor(Math.random() * 500000 + 50000).toLocaleString()}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '4px' }}>
                    <div style={{ color: '#888' }}>COST</div>
                    <div>${(Math.random() * 50 + 5).toFixed(2)}</div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
