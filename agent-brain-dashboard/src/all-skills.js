// All 52 OpenClaw Skills with their categories
export const ALL_SKILLS_DATA = [
  // CORE (6)
  { name: 'clawhub', category: 'CORE', color: '#00f0ff', icon: '📦' },
  { name: 'gemini', category: 'CORE', color: '#00f0ff', icon: '♊' },
  { name: 'healthcheck', category: 'CORE', color: '#00f0ff', icon: '💊' },
  { name: 'skill-creator', category: 'CORE', color: '#00f0ff', icon: '🛠️' },
  { name: 'model-usage', category: 'CORE', color: '#00f0ff', icon: '📊' },
  { name: 'summarize', category: 'CORE', color: '#00f0ff', icon: '📝' },
  
  // COMMUNICATION (6)
  { name: 'discord', category: 'COMM', color: '#ff00aa', icon: '💬' },
  { name: 'slack', category: 'COMM', color: '#ff00aa', icon: '💼' },
  { name: 'bluebubbles', category: 'COMM', color: '#ff00aa', icon: '🫧' },
  { name: 'imsg', category: 'COMM', color: '#ff00aa', icon: '💬' },
  { name: 'voice-call', category: 'COMM', color: '#ff00aa', icon: '📞' },
  { name: 'sherpa-onnx-tts', category: 'COMM', color: '#ff00aa', icon: '🔊' },
  
  // PRODUCTIVITY (8)
  { name: 'notion', category: 'PRODUCTIVITY', color: '#00ff88', icon: '📓' },
  { name: 'obsidian', category: 'PRODUCTIVITY', color: '#00ff88', icon: '🪨' },
  { name: 'trello', category: 'PRODUCTIVITY', color: '#00ff88', icon: '📋' },
  { name: 'things-mac', category: 'PRODUCTIVITY', color: '#00ff88', icon: '✅' },
  { name: 'apple-notes', category: 'PRODUCTIVITY', color: '#00ff88', icon: '📝' },
  { name: 'apple-reminders', category: 'PRODUCTIVITY', color: '#00ff88', icon: '⏰' },
  { name: 'bear-notes', category: 'PRODUCTIVITY', color: '#00ff88', icon: '🐻' },
  { name: 'github', category: 'PRODUCTIVITY', color: '#00ff88', icon: '🐙' },
  
  // MEDIA (8)
  { name: 'spotify-player', category: 'MEDIA', color: '#ffaa00', icon: '🎵' },
  { name: 'sonoscli', category: 'MEDIA', color: '#ffaa00', icon: '🔊' },
  { name: 'blucli', category: 'MEDIA', color: '#ffaa00', icon: '🔵' },
  { name: 'openai-image-gen', category: 'MEDIA', color: '#ffaa00', icon: '🎨' },
  { name: 'openai-whisper', category: 'MEDIA', color: '#ffaa00', icon: '🎤' },
  { name: 'openai-whisper-api', category: 'MEDIA', color: '#ffaa00', icon: '🎙️' },
  { name: 'sag', category: 'MEDIA', color: '#ffaa00', icon: '🎭' },
  { name: 'video-frames', category: 'MEDIA', color: '#ffaa00', icon: '🎬' },
  
  // DATA & DEV (7)
  { name: 'canvas', category: 'DATA', color: '#aa00ff', icon: '🎨' },
  { name: 'gh-issues', category: 'DATA', color: '#aa00ff', icon: '🐛' },
  { name: 'session-logs', category: 'DATA', color: '#aa00ff', icon: '📜' },
  { name: 'coding-agent', category: 'DEV', color: '#aa00ff', icon: '💻' },
  { name: 'tmux', category: 'DEV', color: '#aa00ff', icon: '🖥️' },
  { name: 'nano-banana-pro', category: 'DEV', color: '#aa00ff', icon: '🍌' },
  { name: 'nano-pdf', category: 'DEV', color: '#aa00ff', icon: '📄' },
  
  // HARDWARE (6)
  { name: 'eightctl', category: 'HARDWARE', color: '#ff6600', icon: '🛏️' },
  { name: 'openhue', category: 'HARDWARE', color: '#ff6600', icon: '💡' },
  { name: 'camsnap', category: 'HARDWARE', color: '#ff6600', icon: '📷' },
  { name: 'wacli', category: 'HARDWARE', color: '#ff6600', icon: '📱' },
  { name: 'mcporter', category: 'HARDWARE', color: '#ff6600', icon: '🔌' },
  { name: 'gog', category: 'HARDWARE', color: '#ff6600', icon: '🎮' },
  
  // EXTERNAL (11)
  { name: 'weather', category: 'EXTERNAL', color: '#ff00ff', icon: '🌤️' },
  { name: 'xurl', category: 'EXTERNAL', color: '#ff00ff', icon: '🔗' },
  { name: 'goplaces', category: 'EXTERNAL', color: '#ff00ff', icon: '🗺️' },
  { name: 'gifgrep', category: 'EXTERNAL', color: '#ff00ff', icon: '🎭' },
  { name: 'blogwatcher', category: 'EXTERNAL', color: '#ff00ff', icon: '📰' },
  { name: 'himalaya', category: 'EXTERNAL', color: '#ff00ff', icon: '📧' },
  { name: 'songsee', category: 'EXTERNAL', color: '#ff00ff', icon: '🎵' },
  { name: 'ordercli', category: 'EXTERNAL', color: '#ff00ff', icon: '📦' },
  { name: 'peekaboo', category: 'EXTERNAL', color: '#ff00ff', icon: '👀' },
  { name: 'oracle', category: 'EXTERNAL', color: '#ff00ff', icon: '🔮' },
  { name: '1password', category: 'EXTERNAL', color: '#ff00ff', icon: '🔐' }
];

// CATEGORIES
export const CATEGORIES_DATA = [
  { name: 'CORE', color: '#00f0ff', agents: ['APEX', 'PULSE'] },
  { name: 'COMM', color: '#ff00aa', agents: ['CIPHER'] },
  { name: 'PRODUCTIVITY', color: '#00ff88', agents: ['NEXUS'] },
  { name: 'MEDIA', color: '#ffaa00', agents: ['AURA'] },
  { name: 'DATA', color: '#aa00ff', agents: ['STAT'] },
  { name: 'HARDWARE', color: '#ff6600', agents: ['SYNC'] },
  { name: 'EXTERNAL', color: '#ff00ff', agents: ['ORACLE'] }
];

// MAIN AGENTS
export const MAIN_AGENTS_DATA = [
  { name: 'APEX', role: 'CEO', color: '#00f0ff', active: true, category: 'CORE' },
  { name: 'PULSE', role: 'CMO', color: '#00f0ff', active: true, category: 'CORE' },
  { name: 'CIPHER', role: 'CIO', color: '#ff00aa', active: true, category: 'COMM' },
  { name: 'NEXUS', role: 'COO', color: '#00ff88', active: true, category: 'PRODUCTIVITY' },
  { name: 'STAT', role: 'CAO', color: '#aa00ff', active: true, category: 'DATA' },
  { name: 'AURA', role: 'CSO', color: '#ffaa00', active: false, category: 'MEDIA' },
  { name: 'SYNC', role: 'CHRO', color: '#ff6600', active: false, category: 'HARDWARE' },
  { name: 'ORACLE', role: 'EXT', color: '#ff00ff', active: false, category: 'EXTERNAL' }
];
