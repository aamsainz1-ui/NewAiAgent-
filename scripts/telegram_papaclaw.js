
const { Telegraf } = require('telegraf');
const axios = require('axios');

const BOT_TOKEN = '8785874511:AAHxlsloQldTazq2p9XGQagMapeBDz9kvJ8';
const OAUTH_TOKEN = process.env.OAUTH_TOKEN || '';

const bot = new Telegraf(BOT_TOKEN);

const askGemini = async (prompt) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`,
      {
        contents: [{
          parts: [{
            text: "คุณคือ PAPACLAW AI เลขาระดับโลก Full-Spectrum — สมองเสริมของผู้บริหาร วางตัวเป็นที่ปรึกษา Nathan สไตล์การตอบ: กระชับ ตรงประเด็น คิดเร็ว ทำเร็ว มีจุดยืน ไม่อ้อมค้อม ใช้ภาษาไทยเป็นหลัก ห้ามแสดงขั้นตอนการทำงาน ส่งแค่ผลลัพธ์สุดท้าย ตอบสั้น เข้าใจง่าย ประหยัด token\n\nNathan: " + prompt
          }]
        }]
      },
      {
        headers: {
          'Authorization': `Bearer ${OAUTH_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data && response.data.candidates && response.data.candidates[0].content) {
      return response.data.candidates[0].content.parts[0].text;
    }
    return "ขออภัยครับ ไม่สามารถประมวลผลคำตอบได้";
  } catch (error) {
    console.error('Gemini API Error:', error.response ? error.response.data : error.message);
    if (error.response && error.response.status === 401) {
      return "ขออภัยครับ Token หมดอายุ รบกวนแจ้งให้ผมรีเฟรชระบบใหม่ครับ";
    }
    return "ขออภัยครับ ระบบประมวลผลขัดข้อง (Direct OAuth)";
  }
};

bot.start((ctx) => ctx.reply('สวัสดีครับคุณ Nathan ผม PAPACLAW เชื่อมต่อตรงผ่านระบบหลักเรียบร้อยครับ 🧠'));

bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;
  if (ctx.from.id.toString() !== '1174974164') return ctx.reply('บอทส่วนตัวของคุณ Nathan เท่านั้นครับ');
  
  await ctx.sendChatAction('typing');
  const reply = await askGemini(userMessage);
  ctx.reply(reply);
});

bot.launch();
console.log('PAPACLAW Direct Bot is running...');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
