# คู่มือการสร้าง Browser Automation Fleet ด้วย KVM, WireGuard, และ Socat (อ้างอิงบทความ Nat Weerawan 2026)

เอกสารนี้สรุปขั้นตอนการสร้าง "ฝูงบินเบราว์เซอร์ (Browser Fleet)" จำนวน 5 เครื่องขึ้นไป โดยใช้ฮาร์ดแวร์ผสมระหว่าง Cloud (VPS) และ Home Server เพื่อลดต้นทุน (ตกเดือนละ $12) แต่ได้ประสิทธิภาพเต็มรูปแบบ

## สถาปัตยกรรม (Architecture)
- **Gateway (ผู้จัดการ):** VPS บน DigitalOcean (สเปค s-1vcpu-2gb, SGP1) รัน Ubuntu 24.04 และ OpenClaw
- **Node (คนงาน):** Home Server (เช่น Ryzen 9, RAM 32GB) รัน KVM/QEMU จำลอง Virtual Machine (VM) ออกมา 5 เครื่อง
- **เครือข่าย (Network):** เชื่อมต่อกันด้วย WireGuard VPN
- **ท่อส่งคำสั่ง (Bypass):** ใช้ `socat` เจาะพอร์ตให้ Gateway สั่งงาน Chrome ใน Node ได้ตรงๆ หลบการบล็อก TLS และบั๊กการไม่อนุมัติคำสั่ง Shell

---

## ขั้นตอนการติดตั้ง (Step-by-Step)

### Phase 1: การตั้งค่า Gateway (DigitalOcean)
1. เช่า Droplet และติดตั้ง WireGuard
2. กำหนด `wg0.conf` ให้มี IP `10.10.0.1/24` และรับ Peer จาก KVM Host, Mac ของผู้คุม, และ Node ทั้ง 5
3. ติดตั้ง OpenClaw Gateway 
   - ตั้งค่า `config.json` ให้ `gateway.bind = "lan"` 
   - ตั้งรหัสผ่าน (Token) และตั้ง Port เป็น `18789`
4. ตั้งค่า systemd ให้ OpenClaw รันอัตโนมัติ และใช้คำสั่ง `loginctl enable-linger root` เพื่อป้องกัน Service ดับเมื่อปิด SSH

### Phase 2: การสร้าง Node (Home Server KVM)
1. ดาวน์โหลด Cloud Image (Ubuntu 24.04) มาทำเป็น Base Image
2. ติดตั้งแพ็กเกจที่จำเป็นใน Base Image ได้แก่ `chromium-browser`, `nodejs`, `openclaw`, `xvfb` (หน้าจอจำลอง), `fluxbox`, `x11vnc`, `novnc`, `wireguard-tools`, `socat`
3. สร้าง COW Overlay จาก Base Image เป็น VM 5 ตัว (node-1 ถึง node-5) เพื่อประหยัดพื้นที่ดิสก์
4. กำหนด WireGuard IP ให้แต่ละเครื่องเป็น `10.10.0.11` ถึง `10.10.0.15`

### Phase 3: การทำ CDP Bypass ด้วย Socat (หัวใจสำคัญ)
เนื่องจาก OpenClaw Gateway ไม่สามารถสั่งรัน Shell Command บน Node ได้ และบังคับคุยผ่าน TLS เท่านั้น เราจึงใช้ `socat` หลอกระบบ:

**บนเครื่อง Node (ทั้ง 5 เครื่อง):**
- เปิดให้ Chrome (พอร์ต 18792 ที่รันแต่ localhost) ออกมาสู่วงแลน WireGuard
- รันเป็น Systemd:
  `ExecStart=/usr/bin/socat TCP-LISTEN:18793,fork,reuseaddr,bind=0.0.0.0 TCP:127.0.0.1:18792`

**บนเครื่อง Gateway (สิงคโปร์):**
- ดึงพอร์ตจาก Node (ผ่าน WireGuard) กลับมาจำลองเป็น `localhost` บน Gateway
- รัน socat 5 process สำหรับ 5 nodes:
  - `socat TCP-LISTEN:18801,fork,reuseaddr,bind=127.0.0.1 TCP:10.10.0.11:18793`
  - `socat TCP-LISTEN:18802,fork,reuseaddr,bind=127.0.0.1 TCP:10.10.0.12:18793` (ไปจนถึง 18805)

### Phase 4: การจับคู่ (Pairing) และสั่งงาน
1. ข้ามการ Pairing หน้าเว็บที่มักจะ Error โดยเขียนสคริปต์ Python บน Gateway ดึง Device ID จากไฟล์ `pending.json` ยัดเข้า `paired.json` และสั่ง restart gateway
2. ผู้ควบคุม (MacBook) ต่อ VPN หรือยิง SSH Tunnel (`ssh -L 18789:10.10.0.1:18789 root@152.42.206.137`)
3. เปิดเบราว์เซอร์ไปที่ `http://localhost:18789/dashboard`
4. เมื่อ Gateway เห็นพอร์ต 18801-18805 เป็น `localhost` ของตัวเองแล้ว AI Agent สามารถสั่งงาน Chrome ทั้ง 5 ตัวพร้อมกันได้เลย! (เปิดเว็บ, แคปจอ, Snapshot DOM เสร็จใน 3.7 วินาที)

---

## ⚠️ จุดระวังที่สำคัญ (Gotchas)
- **WireGuard Config:** ถ้าแก้ VPN สดๆ ด้วยคำสั่ง `wg set` ต้องอย่าลืมเซฟเข้าไฟล์ `wg0.conf` เสมอ ไม่งั้นรีบูทแล้วหาย
- **UFW (Firewall):** ต้องอนุญาตให้ ping หากันได้: `ufw allow in on wg0 from 10.10.0.0/24`
- **Chrome Snap Reject:** ในไฟล์ config ตัวแปล `cdpUrl` ให้พิมพ์ว่า `http://localhost:18792` ห้ามใช้ `http://127.0.0.1:18792` เด็ดขาด เพราะ Chrome เวอร์ชั่นใหม่จะปฏิเสธการเชื่อมต่อ

*(ข้อมูลอ้างอิง: บทความ OpenClaw Fleet v2 โดย Nat Weerawan - 2026-02-23)*