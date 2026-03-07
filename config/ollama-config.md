# Ollama Configuration for OpenClaw
# เชื่อมต่อ Ollama Local Models เข้ากับ OpenClaw

## Provider: ollama-local
- baseUrl: http://127.0.0.1:11434
- Type: Local LLM
- Cost: FREE (local compute)

## Available Models

### 1. llama3.2:3b (Recommended)
- **Alias:** llama-local
- **Size:** 3B parameters
- **RAM:** ~4GB
- **Speed:** Fast
- **Best for:** General tasks, quick responses
- **Command:** ollama run llama3.2:3b

### 2. qwen2.5:7b (Thai Language)
- **Alias:** qwen-local  
- **Size:** 7B parameters
- **RAM:** ~6-7GB
- **Speed:** Medium
- **Best for:** Thai language, content writing
- **Command:** ollama run qwen2.5:7b

## How to Use

### Direct Ollama CLI:
```bash
ollama run llama3.2:3b
ollama run qwen2.5:7b
```

### Via OpenClaw (if supported):
Set model to:
- `ollama-local/llama3.2:3b`
- `ollama-local/qwen2.5:7b`

## Fallback Chain (Suggested)
1. google-antigravity/claude-opus-4-6-thinking (Primary)
2. google-antigravity/claude-opus-4-6
3. google-antigravity/claude-sonnet-4-5
4. google-gemini-cli/gemini-3-pro-preview
5. minimax-portal/MiniMax-M2.5 (FREE cloud)
6. **ollama-local/llama3.2:3b** (FREE local) ← NEW
7. **ollama-local/qwen2.5:7b** (FREE local - Thai) ← NEW
8. kimi-coding/k2p5

## Notes
- Ollama runs on 127.0.0.1:11434
- Models are stored in /root/.ollama/models
- No API key required (local)
- Uses local CPU (no GPU detected)
