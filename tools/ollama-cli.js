#!/usr/bin/env node
/**
 * Ollama CLI Tool for OpenClaw
 * เรียกใช้ Ollama Models ผ่าน Command Line
 * 
 * Usage: node ollama-cli.js [model] [prompt]
 * Example: node ollama-cli.js llama3.2:3b "สวัสดี"
 */

import { execSync } from 'child_process';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';

// Available models
const MODELS = {
  'llama': 'llama3.2:3b',
  'llama3.2': 'llama3.2:3b',
  'qwen': 'qwen2.5:7b',
  'qwen2.5': 'qwen2.5:7b',
  'thai': 'qwen2.5:7b'
};

function runOllama(model, prompt) {
  try {
    // Set OLLAMA_HOST environment variable
    const env = { ...process.env, OLLAMA_HOST };
    
    // Run ollama with the prompt
    const result = execSync(
      `echo "${prompt.replace(/"/g, '\\"')}" | ollama run ${model}`,
      { 
        encoding: 'utf8',
        timeout: 120000,
        env,
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer
      }
    );
    
    return result.trim();
  } catch (err) {
    if (err.code === 'ETIMEDOUT') {
      return '⚠️ คำขอหมดเวลา (timeout) - โมเดลอาจใช้เวลานานในการตอบ';
    }
    return `❌ Error: ${err.message}`;
  }
}

function listModels() {
  try {
    const result = execSync('ollama list', { encoding: 'utf8' });
    return result.trim();
  } catch (err) {
    return `❌ Error: ${err.message}`;
  }
}

function showHelp() {
  console.log(`
🦙 Ollama CLI Tool for OpenClaw

Usage:
  node ollama-cli.js [model] "[prompt]"

Models:
  llama, llama3.2  → ใช้ llama3.2:3b (เร็ว)
  qwen, qwen2.5    → ใช้ qwen2.5:7b (ภาษาไทยดี)
  thai             → ใช้ qwen2.5:7b (alias)

Examples:
  node ollama-cli.js llama "สวัสดี"
  node ollama-cli.js qwen "เขียนบทความเกี่ยวกับ AI"
  node ollama-cli.js thai "แปลภาษา"

Other Commands:
  node ollama-cli.js --list     แสดงโมเดลที่ติดตั้ง
  node ollama-cli.js --help     แสดงความช่วยเหลือ
`);
}

// Main
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  showHelp();
  process.exit(0);
}

if (args[0] === '--list' || args[0] === '-l') {
  console.log('📦 Installed Models:\n');
  console.log(listModels());
  process.exit(0);
}

if (args.length < 2) {
  console.log('❌ ต้องระบุทั้ง model และ prompt');
  console.log('ตัวอย่าง: node ollama-cli.js llama "สวัสดี"');
  process.exit(1);
}

const modelAlias = args[0];
const prompt = args[1];

const model = MODELS[modelAlias] || modelAlias;

console.log(`🦙 Running ${model}...`);
console.log(`💬 Prompt: ${prompt}\n`);
console.log('─'.repeat(50));

const response = runOllama(model, prompt);

console.log(response);
console.log('\n' + '─'.repeat(50));
