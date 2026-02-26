/**
 * generate-data.js — Auto-generate dashboardData.js from workspace files
 *
 * Reads:
 *   - skills/              → skill nodes (detect category from SKILL.md)
 *   - openclaw.json         → model nodes
 *   - MEMORY.md             → memory data nodes + memories panel
 *   - memory/*.md           → log entries
 *
 * Run: node scripts/generate-data.js
 * Output: src/data/dashboardData.js
 */
import { readdirSync, readFileSync, existsSync, writeFileSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');
const WORKSPACE = resolve(ROOT, '..');
const SKILLS_DIR = join(WORKSPACE, 'skills');
const MEMORY_DIR = join(WORKSPACE, 'memory');
const MEMORY_FILE = join(WORKSPACE, 'MEMORY.md');
const CONFIG_FILE = join(WORKSPACE, '..', 'openclaw.json');
const SESSIONS_DIR = join(WORKSPACE, '..', 'agents', 'main', 'sessions');
const OUT_FILE = join(ROOT, 'src', 'data', 'dashboardData.js');

// ─── Category detection from SKILL.md description ───
const categoryKeywords = {
  seo: ['seo', 'keyword', 'content-creator', 'competitor', 'performance-reporter', 'on-page', 'technical-seo', 'seo-content', 'backlink', 'rank'],
  browser: ['browser', 'playwright', 'scraper', 'firecrawl', 'linkedin', 'stagehand', 'gemini-computer', 'clawbrowser', 'automation'],
  memory: ['memory', 'pkm', 'openclaw-mem', 'knowledge', 'obsidian', 'notion', 'bear-notes', 'apple-notes', 'summarize', 'session-logs'],
  business: ['crm', 'hubspot', 'zoho', 'sales', 'activecampaign', 'trello', 'slack', 'discord', 'github'],
  finance: ['invoice', 'ledger', 'freshbooks', 'billing', 'payment', 'trading', 'day-trading', 'crypto', 'oracle'],
  project: ['todoist', 'mission-control', 'taskmaster', 'proactive', 'kanban', 'task', 'coding-agent'],
  calendar: ['calendar', 'calendly', 'outlook', 'email', 'scheduling', 'reminders', 'apple-reminders', 'things-mac'],
  analytics: ['analytics', 'data-analyst', 'business-model', 'report', 'model-usage', 'blogwatcher'],
  football: ['football', 'match', 'soccer', 'วิเคราะห์บอล'],
  media: ['image', 'openai-image', 'video-frames', 'tts', 'whisper', 'sag', 'sherpa', 'voice', 'voice-call', 'gifgrep', 'spotify', 'songsee', 'sonoscli', 'camsnap', 'peekaboo', 'canvas', 'nano-pdf', 'nano-banana'],
  messaging: ['imsg', 'bluebubbles', 'wacli', 'blucli'],
  infra: ['clawhub', 'healthcheck', 'skill-creator', 'website', 'gemini', 'expert', '1password', 'eightctl', 'openhue', 'tmux', 'himalaya', 'mcporter', 'gog', 'goplaces', 'weather', 'food-order', 'ordercli'],
};

function detectCategory(name, desc) {
  const text = (name + ' ' + desc).toLowerCase();
  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(kw => text.includes(kw))) return cat;
  }
  return 'inactive';
}

// ─── All installed skills are considered active ───

// ─── Scan skills directory ───
function scanSkills() {
  const dirs = readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  return dirs.map(name => {
    let desc = '';
    const skillMd = join(SKILLS_DIR, name, 'SKILL.md');
    if (existsSync(skillMd)) {
      const content = readFileSync(skillMd, 'utf-8');
      const descMatch = content.match(/description[:\s]*(.+)/i);
      if (descMatch) desc = descMatch[1].trim();
    }
    const cat = detectCategory(name, desc);
    const weight = 0.3 + Math.random() * 0.6;
    return {
      id: `skill-${name}`,
      label: name,
      type: 'skill',
      category: cat,
      active: true,
      weight: Math.round(weight * 100) / 100,
    };
  });
}

// ─── Parse models from config ───
function scanModels() {
  if (!existsSync(CONFIG_FILE)) return [];
  const config = JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'));
  const primary = config?.agents?.defaults?.model?.primary;
  const fallbacks = config?.agents?.defaults?.model?.fallbacks || [];
  const models = config?.agents?.defaults?.model?.models || {};

  const allModelIds = new Set();
  if (primary) allModelIds.add(primary);
  fallbacks.forEach(f => allModelIds.add(f));
  Object.keys(models).forEach(m => allModelIds.add(m));

  const labelMap = {
    'claude-opus-4-6-thinking': 'Claude Opus 4.6',
    'gpt-5.1-codex': 'GPT-5.1 Codex',
    'gemini-3-pro-preview': 'Gemini 3 Pro',
    'gpt-4o': 'GPT-4o',
    'gpt-4o-2024-08-06': 'GPT-4o (0806)',
    'gpt-4.1-mini': 'GPT-4.1 Mini',
    'gpt-4o-mini': 'GPT-4o Mini',
    'glm-5': 'GLM-5',
  };

  // Also scan custom providers (models.providers.*)
  const providers = config?.models?.providers || {};
  for (const [provName, provConfig] of Object.entries(providers)) {
    const provModels = provConfig?.models || [];
    provModels.forEach(m => {
      const mId = typeof m === 'string' ? m : (m.id || m.name || '');
      if (mId) allModelIds.add(`${provName}/${mId}`);
    });
  }

  const usageMap = {
    'Claude Opus 4.6': ['seo', 'memory', 'infra', 'mem-data', 'browser', 'business', 'finance', 'project', 'calendar', 'analytics', 'football', 'media', 'messaging'],
    'GPT-5.1 Codex': ['seo', 'browser', 'infra', 'football', 'media'],
    'Gemini 3 Pro': ['browser', 'analytics', 'seo', 'football', 'media'],
    'GPT-4o': ['seo', 'business', 'browser', 'media'],
    'GPT-4o (0806)': ['seo', 'business', 'analytics'],
    'GPT-4.1 Mini': ['browser', 'project', 'messaging'],
    'GPT-4o Mini': ['browser', 'messaging', 'infra'],
    'GLM-5': ['seo', 'analytics', 'football', 'infra'],
  };

  const result = [];
  let w = 1.0;
  for (const modelId of allModelIds) {
    const shortName = modelId.split('/').pop();
    // Match longest key first to avoid 'gpt-4o' matching 'gpt-4o-mini'
    const sortedEntries = Object.entries(labelMap).sort((a, b) => b[0].length - a[0].length);
    const match = sortedEntries.find(([k]) => shortName.includes(k));
    const label = match ? match[1] : shortName;
    if (result.some(m => m.label === label)) continue; // dedup
    result.push({
      id: `model-${label.toLowerCase().replace(/[\s.()]/g, '-')}`,
      label,
      type: 'model',
      category: 'model',
      active: true,
      weight: Math.round(w * 100) / 100,
      _usage: usageMap[label] || [],
    });
    w = Math.max(0.3, w - 0.1);
  }
  return result;
}

// ─── Parse MEMORY.md for memory nodes + panel items ───
function scanMemory() {
  const nodes = [];
  const memories = [];

  if (existsSync(MEMORY_FILE)) {
    const content = readFileSync(MEMORY_FILE, 'utf-8');
    const lines = content.split('\n');
    let currentSection = '';

    for (const line of lines) {
      if (line.startsWith('## ')) {
        currentSection = line.replace('## ', '').trim();
      }

      // Tagged entries: FACT-*, DEC-*, PREF-*
      const tagMatch = line.match(/^## (FACT|DEC|PREF)-(\d{4}-\d{2}-\d{2})-(\d+)/);
      if (tagMatch) {
        const [, type, date, num] = tagMatch;
        const id = `mem-${type.toLowerCase()}-${date}-${num}`;
        // Read next lines for detail
        const idx = lines.indexOf(line);
        const areaLine = lines[idx + 2] || '';
        const area = areaLine.replace('area:', '').trim();
        nodes.push({
          id, label: `${type}: ${area || currentSection}`, type: 'memory',
          category: 'mem-data', active: true, weight: 0.5 + Math.random() * 0.3,
        });
        memories.push({
          id, category: type === 'FACT' ? 'fact' : type === 'DEC' ? 'decision' : 'pref',
          title: area || currentSection, detail: '', date,
        });
      }

      // Preference bullets
      if (currentSection.includes('Preferences') && line.startsWith('- ')) {
        const text = line.replace('- ', '').trim().substring(0, 40);
        const id = `mem-pref-${nodes.length}`;
        if (!nodes.some(n => n.label.includes(text.substring(0, 15)))) {
          nodes.push({
            id, label: `PREF: ${text}`, type: 'memory',
            category: 'mem-data', active: true, weight: 0.6,
          });
          memories.push({
            id, category: 'pref', title: text, detail: line.replace('- ', ''), date: '2026-02-14',
          });
        }
      }

      // About section
      if (currentSection === 'About Nathan' && line.startsWith('- **')) {
        const m = line.match(/\*\*(.+?)\*\*:?\s*(.+)/);
        if (m) {
          const id = `mem-about-${m[1].toLowerCase().replace(/\s/g, '')}`;
          if (!nodes.some(n => n.id === id)) {
            nodes.push({
              id, label: `About: ${m[1]}`, type: 'memory',
              category: 'mem-data', active: true, weight: 0.7,
            });
            memories.push({
              id, category: 'kb', title: `Nathan ${m[1]}`, detail: m[2], date: '2026-02-14',
            });
          }
        }
      }
    }

    // Installed skills as a single node
    if (content.includes('Installed Skills')) {
      nodes.push({
        id: 'mem-skills', label: 'FACT: Installed Skills', type: 'memory',
        category: 'mem-data', active: true, weight: 0.5,
      });
    }

    // Session log entries
    const logMatch = content.match(/## Session Log[\s\S]*?(?=\n## |$)/);
    if (logMatch) {
      const logLines = logMatch[0].split('\n').filter(l => l.startsWith('- '));
      logLines.forEach(l => {
        const dm = l.match(/- (\d{4}-\d{2}-\d{2}): (.+)/);
        if (dm) {
          const id = `mem-log-${dm[1]}`;
          if (!nodes.some(n => n.id === id)) {
            nodes.push({
              id, label: `LOG: ${dm[1].slice(5)}`, type: 'memory',
              category: 'mem-data', active: true, weight: 0.55,
            });
            memories.push({
              id, category: 'log', title: dm[1], detail: dm[2].substring(0, 60), date: dm[1],
            });
          }
        }
      });
    }
  }

  // Scan memory/*.md for daily logs
  if (existsSync(MEMORY_DIR)) {
    const files = readdirSync(MEMORY_DIR).filter(f => f.endsWith('.md'));
    files.forEach(f => {
      const date = f.replace('.md', '');
      const id = `mem-log-${date}`;
      if (!nodes.some(n => n.id === id)) {
        nodes.push({
          id, label: `LOG: ${date.slice(5)}`, type: 'memory',
          category: 'mem-data', active: true, weight: 0.55,
        });
        // Read first heading as title
        const content = readFileSync(join(MEMORY_DIR, f), 'utf-8');
        const heading = content.match(/^# (.+)/)?.[1] || date;
        memories.push({ id, category: 'log', title: heading, detail: date, date });
      }
    });
  }

  // KB files
  const kbDir = join(WORKSPACE, 'kb');
  if (existsSync(kbDir)) {
    const kbFiles = readdirSync(kbDir).filter(f => f.endsWith('.md'));
    kbFiles.forEach(f => {
      const name = f.replace('.md', '');
      const id = `mem-kb-${name}`;
      nodes.push({
        id, label: `KB: ${name}`, type: 'memory',
        category: 'mem-data', active: true, weight: 0.5,
      });
      memories.push({ id, category: 'kb', title: name, detail: '', date: '2026-02-14' });
    });
  }

  return { nodes, memories };
}

// ─── Layout zones ───

// ─── Scan session JSONL files for model usage stats ───
function scanModelUsage() {
  const stats = {};
  if (!existsSync(SESSIONS_DIR)) return [];
  const files = readdirSync(SESSIONS_DIR).filter(f => f.endsWith('.jsonl'));
  files.forEach(f => {
    const content = readFileSync(join(SESSIONS_DIR, f), 'utf-8');
    const lines = content.split('\n').filter(Boolean);
    lines.forEach(l => {
      try {
        const entry = JSON.parse(l);
        if (entry.type === 'message' && entry.message) {
          const msg = entry.message;
          if (msg.usage && msg.model) {
            const model = msg.model;
            if (model === 'delivery-mirror') return; // skip internal
            if (!stats[model]) stats[model] = { calls: 0, inputTokens: 0, outputTokens: 0, cacheRead: 0, totalTokens: 0, cost: 0 };
            stats[model].calls++;
            stats[model].inputTokens += msg.usage.input || 0;
            stats[model].outputTokens += msg.usage.output || 0;
            stats[model].cacheRead += msg.usage.cacheRead || 0;
            stats[model].totalTokens += msg.usage.totalTokens || 0;
            if (msg.usage.cost) stats[model].cost += msg.usage.cost.total || 0;
          }
        }
      } catch (e) { /* skip parse errors */ }
    });
  });

  const labelMap = {
    'claude-opus-4-6-thinking': 'Claude Opus 4.6',
    'gpt-5.1-codex': 'GPT-5.1 Codex',
    'gemini-3-pro-preview': 'Gemini 3 Pro',
    'gpt-4o': 'GPT-4o',
    'gpt-4o-2024-08-06': 'GPT-4o (0806)',
    'gpt-4.1-mini': 'GPT-4.1 Mini',
    'gpt-4o-mini': 'GPT-4o Mini',
    'glm-5': 'GLM-5',
  };

  return Object.entries(stats)
    .map(([model, s]) => ({
      model: labelMap[model] || model,
      modelId: model,
      calls: s.calls,
      inputTokens: s.inputTokens,
      outputTokens: s.outputTokens,
      cacheRead: s.cacheRead,
      totalTokens: s.totalTokens,
      cost: Math.round(s.cost * 100) / 100,
    }))
    .sort((a, b) => b.totalTokens - a.totalTokens);
}

// ─── Orbital layout — PAPACLAW at center, everything orbits around it ───
function generatePositions(items) {
  const result = [];

  // Separate by type
  const agents = items.filter(i => i.type === 'agent');
  const models = items.filter(i => i.type === 'model');
  const skills = items.filter(i => i.type === 'skill');
  const memories = items.filter(i => i.type === 'memory');

  // Ring 0: PAPACLAW at dead center (0,0,0), other agents nearby
  agents.forEach((item, i) => {
    if (item.id === 'agent-main') {
      result.push({ ...item, position: [0, 0, 0] });
    } else {
      const a = ((i - 1) / Math.max(agents.length - 1, 1)) * Math.PI * 2;
      result.push({ ...item, position: [
        Math.round(Math.cos(a) * 1.5 * 1000) / 1000,
        0.3,
        Math.round(Math.sin(a) * 1.5 * 1000) / 1000,
      ]});
    }
  });

  // Ring 1: Models — orbit at radius ~4
  models.forEach((item, i) => {
    const a = (i / models.length) * Math.PI * 2;
    const r = 4.0;
    const elev = Math.sin(a * 1.5) * 0.8;
    result.push({ ...item, position: [
      Math.round(r * Math.cos(a) * 1000) / 1000,
      Math.round(elev * 1000) / 1000,
      Math.round(r * Math.sin(a) * 1000) / 1000,
    ]});
  });

  // Ring 2: Skills — grouped by category in sectors, radius 7-12
  const skillCats = {};
  skills.forEach(s => {
    const cat = s.category || 'inactive';
    if (!skillCats[cat]) skillCats[cat] = [];
    skillCats[cat].push(s);
  });
  const catList = Object.keys(skillCats);
  catList.forEach((cat, ci) => {
    const sectorAngle = (ci / catList.length) * Math.PI * 2;
    const catSkills = skillCats[cat];
    const sectorSpread = Math.min(0.5, catSkills.length * 0.04);

    catSkills.forEach((item, si) => {
      const nodeAngle = sectorAngle + (si / catSkills.length - 0.5) * sectorSpread * Math.PI;
      const r = 8 + (si % 3) * 1.5;
      const elev = (si % 5 - 2) * 1.2;
      result.push({ ...item, position: [
        Math.round(r * Math.cos(nodeAngle) * 1000) / 1000,
        Math.round(elev * 1000) / 1000,
        Math.round(r * Math.sin(nodeAngle) * 1000) / 1000,
      ]});
    });
  });

  // Ring 3: Memory — outer orbit radius 14-16
  memories.forEach((item, i) => {
    const phi = Math.acos(-1 + (2 * i + 1) / memories.length);
    const theta = Math.sqrt(memories.length * Math.PI) * phi;
    const r = 14 + (i % 3) * 1.0;
    result.push({ ...item, position: [
      Math.round(r * Math.cos(theta) * Math.sin(phi) * 1000) / 1000,
      Math.round(r * Math.cos(phi) * 0.5 * 1000) / 1000,
      Math.round(r * Math.sin(theta) * Math.sin(phi) * 1000) / 1000,
    ]});
  });

  return result;
}

// ─── Build ───
console.log('Scanning skills...');
const skills = scanSkills();
console.log(`  Found ${skills.length} skills (${skills.filter(s => s.active).length} active)`);

console.log('Scanning models...');
const models = scanModels();
console.log(`  Found ${models.length} models`);

console.log('Scanning memory...');
const { nodes: memNodes, memories } = scanMemory();
console.log(`  Found ${memNodes.length} memory nodes, ${memories.length} panel items`);

console.log('Scanning model usage...');
const modelUsage = scanModelUsage();
console.log(`  Found ${modelUsage.length} models with usage data`);

// Agents
const agents = [
  { id: 'agent-main', label: 'PAPACLAW', type: 'agent', category: 'agent', active: true, weight: 1.0 },
  { id: 'agent-runner', label: 'Playwright Runner', type: 'agent', category: 'agent', active: true, weight: 0.7 },
];

const allItems = [...agents, ...models.map(({ _usage, ...m }) => m), ...skills, ...memNodes];
const nodesWithPositions = generatePositions(allItems);

// Edges — structured and meaningful connections
const edges = [];
const agentNodes = nodesWithPositions.filter(n => n.type === 'agent');
const activeSkillNodes = nodesWithPositions.filter(n => n.type === 'skill' && n.active);
const memoryNodesPos = nodesWithPositions.filter(n => n.type === 'memory');
const modelNodesPos = nodesWithPositions.filter(n => n.type === 'model');

// 1. Agent → Models (strong, visible)
agentNodes.forEach(agent => {
  modelNodesPos.forEach(model => {
    edges.push({ source: agent.id, target: model.id, weight: 0.8, edgeType: 'agent-model' });
  });
});

// 2. Model → category lead skills (each model connects to top 2 per category it serves)
models.forEach(model => {
  const usageCats = model._usage || [];
  usageCats.forEach(cat => {
    const catSkills = activeSkillNodes.filter(s => s.category === cat)
      .sort((a, b) => (b.weight || 0) - (a.weight || 0))
      .slice(0, 2);
    catSkills.forEach(skill => {
      edges.push({ source: model.id, target: skill.id, weight: 0.5, edgeType: 'model-skill' });
    });
  });
});

// 3. Intra-category connections (skills in same category connect to each other like a chain)
const catGroups = {};
activeSkillNodes.forEach(s => {
  if (!catGroups[s.category]) catGroups[s.category] = [];
  catGroups[s.category].push(s);
});
for (const [, catSkills] of Object.entries(catGroups)) {
  for (let i = 0; i < catSkills.length; i++) {
    // Chain: connect each to next
    if (i < catSkills.length - 1) {
      edges.push({ source: catSkills[i].id, target: catSkills[i + 1].id, weight: 0.35, edgeType: 'intra-category' });
    }
    // Close the loop if 3+ nodes
    if (i === catSkills.length - 1 && catSkills.length >= 3) {
      edges.push({ source: catSkills[i].id, target: catSkills[0].id, weight: 0.25, edgeType: 'intra-category' });
    }
  }
}

// 4. Agent → top 3 memory nodes
agentNodes.forEach(agent => {
  memoryNodesPos.sort((a, b) => (b.weight || 0) - (a.weight || 0)).slice(0, 5).forEach(mem => {
    edges.push({ source: agent.id, target: mem.id, weight: 0.4, edgeType: 'agent-memory' });
  });
});

// 5. Memory inter-connections (chain nearby memory nodes)
for (let i = 0; i < memoryNodesPos.length - 1; i++) {
  edges.push({ source: memoryNodesPos[i].id, target: memoryNodesPos[i + 1].id, weight: 0.2, edgeType: 'memory-chain' });
}
if (memoryNodesPos.length >= 3) {
  edges.push({ source: memoryNodesPos[memoryNodesPos.length - 1].id, target: memoryNodesPos[0].id, weight: 0.15, edgeType: 'memory-chain' });
}

// 6. Cross-category bridges (connect related categories)
const bridges = [
  ['seo', 'analytics'], ['seo', 'browser'], ['business', 'finance'],
  ['project', 'infra'], ['calendar', 'project'], ['memory', 'infra'],
  ['football', 'analytics'], ['browser', 'football'],
  ['media', 'browser'], ['media', 'memory'], ['messaging', 'business'],
  ['messaging', 'infra'], ['infra', 'analytics'], ['media', 'seo'],
  ['finance', 'analytics'], ['calendar', 'messaging'],
];
bridges.forEach(([catA, catB]) => {
  const a = activeSkillNodes.find(s => s.category === catA);
  const b = activeSkillNodes.find(s => s.category === catB);
  if (a && b) {
    edges.push({ source: a.id, target: b.id, weight: 0.3, edgeType: 'cross-category' });
  }
});

// Activity (recent from memory logs)
const activity = [];
if (existsSync(MEMORY_DIR)) {
  const files = readdirSync(MEMORY_DIR).filter(f => f.endsWith('.md')).sort().reverse().slice(0, 5);
  files.forEach(f => {
    const date = f.replace('.md', '');
    const content = readFileSync(join(MEMORY_DIR, f), 'utf-8');
    const headings = content.match(/^## .+/gm) || [];
    headings.slice(0, 3).forEach(h => {
      activity.push({
        timestamp: `${date}T05:00:00Z`,
        label: h.replace('## ', ''),
        detail: date,
      });
    });
  });
}

// Dashboard agent cards
const agentCards = [
  { name: 'PAPACLAW', status: 'online', model: 'claude-opus-4.6 / glm-5', runs: 156, avgLatency: 3.2, energy: 0.88 },
  { name: 'Playwright Runner', status: 'standby', model: 'gpt-4o-mini', runs: 42, avgLatency: 6.8, energy: 0.63 },
  { name: 'Football Analyst', status: 'online', model: 'gpt-5.1-codex', runs: 28, avgLatency: 4.5, energy: 0.75 },
];

// Skill summary for widgets — show diverse categories
const skillsByCategory = {};
activeSkillNodes.forEach(s => {
  if (!skillsByCategory[s.category]) skillsByCategory[s.category] = [];
  skillsByCategory[s.category].push(s);
});
const skillSummary = [];
// Pick top from each category
for (const [cat, catSkills] of Object.entries(skillsByCategory)) {
  catSkills.sort((a, b) => (b.weight || 0) - (a.weight || 0));
  catSkills.slice(0, 2).forEach(s => {
    skillSummary.push({
      name: s.label,
      category: cat,
      usage: Math.floor(5 + (s.weight || 0.3) * 30),
      successRate: Math.round((0.82 + (s.weight || 0.3) * 0.15) * 100) / 100,
      impact: Math.round((s.weight || 0.3) * 100) / 100,
    });
  });
}
// Cap at 16
skillSummary.splice(16);

const totalNodes = nodesWithPositions.length;
const totalEdges = edges.length;

// ─── Write output ───
const output = `// AUTO-GENERATED by scripts/generate-data.js — DO NOT EDIT
// Generated: ${new Date().toISOString()}
// Nodes: ${totalNodes} | Edges: ${totalEdges}

export const dashboardData = ${JSON.stringify({
  agents: agentCards,
  skills: skillSummary,
  activity,
  graph: { nodes: nodesWithPositions, edges },
  memories,
  modelUsage,
}, null, 2)};
`;

writeFileSync(OUT_FILE, output, 'utf-8');
console.log(`\n✅ Generated ${OUT_FILE}`);
console.log(`   ${totalNodes} nodes, ${totalEdges} edges, ${memories.length} memories, ${activity.length} activities`);
