const express = require('express');
const cors = require('cors');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

// Cache with TTL
let cache = {};
const CACHE_TTL = 5000;

// Action nodes (ephemeral - created when tools are used)
const actionNodes = []; // { id, type, name, createdAt, expiresAt }
const ACTION_TTL = 8000; // 8 seconds lifespan

function addActionNode(name, type = 'action') {
  const id = `action:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  const now = Date.now();
  actionNodes.push({
    id,
    type,
    name,
    createdAt: now,
    expiresAt: now + ACTION_TTL,
  });
  // Clean up expired
  while (actionNodes.length && actionNodes[0].expiresAt < now) actionNodes.shift();
  return id;
}

// API to add action node (for testing/demo)
app.use(express.json());
app.post('/api/live/action', (req, res) => {
  const { name, type } = req.body;
  const id = addActionNode(name, type || 'action');
  res.json({ id, message: 'Action node added' });
});

// Get action nodes
app.get('/api/live/actions', (req, res) => {
  const now = Date.now();
  const valid = actionNodes.filter(n => n.expiresAt > now);
  res.json(valid);
});

function cached(key, fn) {
  const now = Date.now();
  if (cache[key] && now - cache[key].ts < CACHE_TTL) return cache[key].data;
  const data = fn();
  cache[key] = { data, ts: now };
  return data;
}

// Get OpenClaw config
function getConfig() {
  try {
    return JSON.parse(fs.readFileSync('/root/.openclaw/openclaw.json', 'utf8'));
  } catch { return {}; }
}

// Get real models from config
app.get('/api/live/models', (req, res) => {
  const data = cached('models', () => {
    const config = getConfig();
    const defaults = config?.agents?.defaults?.model || {};
    const primary = defaults.primary || 'unknown';
    const fallbacks = defaults.fallbacks || [];

    // Extract clean model names (de-dupe; primary can appear in fallbacks)
    const seen = new Set();
    const allModels = [primary, ...fallbacks]
      .filter(m => {
        if (seen.has(m)) return false;
        seen.add(m);
        return true;
      })
      .map(m => {
        const parts = m.split('/');
        return {
          id: m,
          provider: parts[0] || 'unknown',
          name: parts[1] || m,
          isPrimary: m === primary,
        };
      });
    return allModels;
  });
  res.json(data);
});

// Get real skills (base + extensions)
app.get('/api/live/skills', (req, res) => {
  const data = cached('skills', () => {
    const baseSkillsDir = '/usr/lib/node_modules/openclaw/skills';
    const extSkillsDirs = [
      '/usr/lib/node_modules/openclaw/extensions/acpx/skills',
      '/usr/lib/node_modules/openclaw/extensions/feishu/skills',
      '/usr/lib/node_modules/openclaw/extensions/open-prose/skills',
    ];
    let skills = [];
    try {
      // Base skills
      skills = fs.readdirSync(baseSkillsDir).map(name => ({
        id: name,
        name: name,
        path: path.join(baseSkillsDir, name),
      }));
      // Extension skills
      for (const dir of extSkillsDirs) {
        try {
          const extSkills = fs.readdirSync(dir).map(name => ({
            id: name,
            name: name,
            path: path.join(dir, name),
          }));
          skills = [...skills, ...extSkills];
        } catch {}
      }
    } catch { return []; }
    return skills;
  });
  res.json(data);
});

// Get active sessions
app.get('/api/live/sessions', (req, res) => {
  const data = cached('sessions', () => {
    try {
      const output = execSync('openclaw sessions list --json 2>/dev/null || echo "[]"', { timeout: 5000 }).toString();
      return JSON.parse(output);
    } catch { return []; }
  });
  res.json(data);
});

// Get agents from config
app.get('/api/live/agents', (req, res) => {
  const data = cached('agents', () => {
    const config = getConfig();
    const instances = config?.agents?.instances || {};
    return Object.entries(instances).map(([name, cfg]) => ({
      id: name,
      name: name,
      model: cfg?.model?.primary || 'default',
      workspace: cfg?.workspace || 'default',
    }));
  });
  res.json(data);
});

// Combined endpoint - everything in one call
app.get('/api/live/all', (req, res) => {
  const config = getConfig();
  const defaults = config?.agents?.defaults?.model || {};
  const primary = defaults.primary || 'unknown';
  const fallbacks = defaults.fallbacks || [];

  // De-duplicate models (primary can appear in fallbacks)
  const seenModelIds = new Set();
  const models = [primary, ...fallbacks]
    .filter(m => {
      if (seenModelIds.has(m)) return false;
      seenModelIds.add(m);
      return true;
    })
    .map(m => {
      const parts = m.split('/');
      return { id: m, provider: parts[0], name: parts[1] || m, isPrimary: m === primary };
    });

  const baseSkillsDir = '/usr/lib/node_modules/openclaw/skills';
  const extSkillsDirs = [
    '/usr/lib/node_modules/openclaw/extensions/acpx/skills',
    '/usr/lib/node_modules/openclaw/extensions/feishu/skills',
    '/usr/lib/node_modules/openclaw/extensions/open-prose/skills',
  ];
  let skills = [];
  try {
    skills = fs.readdirSync(baseSkillsDir).map(n => ({ id: n, name: n }));
    for (const dir of extSkillsDirs) {
      try {
        skills = [...skills, ...fs.readdirSync(dir).map(n => ({ id: n, name: n }))];
      } catch {}
    }
  } catch {}

  const instances = config?.agents?.instances || {};
  const agents = Object.entries(instances).map(([name, cfg]) => ({
    id: name, name, model: cfg?.model?.primary || 'default',
  }));

  // Knowledge nodes (read from memory directory)
  let knowledge = [];
  try {
    const memDir = '/root/.openclaw/workspace/research/memory';
    if (fs.existsSync(memDir)) {
      const files = fs.readdirSync(memDir)
        .filter(f => f.endsWith('.md'))
        .map(f => {
          const stat = fs.statSync(path.join(memDir, f));
          return { name: f.replace('.md', ''), mtime: stat.mtime.getTime() };
        })
        .sort((a, b) => b.mtime - a.mtime)
        .slice(0, 5); // top 5 recent knowledge
      knowledge = files.map(f => ({ id: `kb:${f.name}`, name: f.name }));
    }
  } catch (e) {
    console.error("Error reading knowledge:", e);
  }

  // MC agents + tasks
  let mcAgents = [], mcTasks = [];
  try {
    mcAgents = JSON.parse(execSync('curl -s http://127.0.0.1:4000/api/agents', { timeout: 3000 }).toString());
    mcTasks = JSON.parse(execSync('curl -s http://127.0.0.1:4000/api/tasks', { timeout: 3000 }).toString());
  } catch {}

  // Usage edges ("จริง" จาก MC + config + skill usage)
  const usageEdges = [];

  // Edge kinds for coloring:
  // - task_assigned: task -> agent (MC task assignment)
  // - agent_model: agent -> model (default model for agent)
  // - skill_used: agent -> skill (simulated from skill names)

  const edgeKinds = ['task_assigned', 'agent_model', 'skill_used'];
  const edgeColors = {
    task_assigned: '#ffaa00',  // orange - task assignment
    agent_model: '#00ffaa',    // cyan - agent uses model
    skill_used: '#ff55ff',     // magenta - agent uses skill
  };

  // Model name used for edges in 3dmap: live:<model.name>
  const primaryModelName = (models.find(m => m.isPrimary)?.name) || (models[0]?.name);

  // task -> agent edges (MC)
  for (const t of mcTasks || []) {
    const agentName = t.assigned_agent_name || t.assigned_agent?.name;
    if (!agentName) continue;
    usageEdges.push({
      source: `mc:${agentName}`,
      target: `task:${t.id}`,
      kind: 'task_assigned',
      ts: t.updated_at || t.created_at || null,
      weight: 0.8, // tasks are important
    });
  }

  // agent -> model edges (config default model as baseline)
  if (primaryModelName) {
    for (const a of mcAgents || []) {
      usageEdges.push({
        source: `mc:${a.name}`,
        target: `live:${primaryModelName}`,
        kind: 'agent_model',
        ts: null,
        weight: 0.5,
      });
    }
  }
  
  // agent -> skill edges (simulated based on skill categories)
  // Map skill prefixes to potential agents (simplified heuristic)
  const skillAgentMap = {
    'github': ['researcher', 'coder'],
    'web': ['researcher'],
    'memory': ['researcher'],
    'cron': ['researcher'],
    'gog': ['assistant'],
    'coding': ['coder'],
    'session': ['researcher'],
  };
  
  for (const skill of skills || []) {
    const sname = skill.name.toLowerCase();
    for (const [prefix, agents] of Object.entries(skillAgentMap)) {
      if (sname.includes(prefix)) {
        for (const ag of agents) {
          // Find matching MC agent
          const mcAgent = mcAgents.find(a => a.name.toLowerCase().includes(ag));
          if (mcAgent) {
            usageEdges.push({
              source: `mc:${mcAgent.name}`,
              target: `live:skill:${skill.name}`,
              kind: 'skill_used',
              ts: null,
              weight: 0.3 + Math.random() * 0.4, // varied weight
            });
          }
        }
      }
    }
  }
  
  // Action nodes (ephemeral)
  const now = Date.now();
  const activeActions = actionNodes.filter(n => n.expiresAt > now).map(n => ({
    id: n.id,
    type: 'action',
    name: n.name,
    createdAt: n.createdAt,
    expiresAt: n.expiresAt,
    remainingMs: n.expiresAt - now,
  }));
  
  res.json({ models, skills, agents, mcAgents, mcTasks, knowledge, usageEdges, actionNodes: activeActions, timestamp: Date.now() });
});

const PORT = 4001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Live data API running on http://0.0.0.0:${PORT}`);
});
