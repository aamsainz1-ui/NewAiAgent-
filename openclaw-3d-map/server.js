import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);
const app = express();
app.use(cors());

app.get('/api/claw-status', async (req, res) => {
  try {
    // ดึงสถานะจริงๆ จากเครื่องที่รัน OpenClaw (ubuntu server)
    // 1. System Info (RAM/CPU)
    const { stdout: memOut } = await execPromise("free -m | awk 'NR==2{printf \"%.2f\", $3*100/$2 }'");
    const { stdout: uptimeOut } = await execPromise("uptime -p");
    
    // 2. OpenClaw Status (จำลองการอ่าน log หรือ process)
    const { stdout: psOut } = await execPromise("ps aux | grep -c 'openclaw'");
    
    // 3. Models (จำลองการอ่านไฟล์ config)
    const { stdout: configOut } = await execPromise("cat ~/.openclaw/config.json | grep 'model' || echo '{}'");

    res.json({
      timestamp: new Date().toISOString(),
      system: {
        ram_usage_percent: memOut.trim(),
        uptime: uptimeOut.trim(),
        active_processes: parseInt(psOut.trim(), 10) - 2
      },
      openclaw: {
        status: "Online",
        active_agents: 1,
        active_sessions: Math.floor(Math.random() * 5) + 1 // placeholder
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`OpenClaw Real-time API listening on port ${PORT}`);
});
