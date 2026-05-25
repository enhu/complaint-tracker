const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// ---- 鏁版嵁鏂囦欢璺緞 ----
// 鏀寔 Railway 鎸佷箙鍗凤細濡傛灉璁剧疆浜?DATA_DIR 鐜鍙橀噺锛屼娇鐢ㄥ畠
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'tickets.json');
const LOCK_FILE = path.join(DATA_DIR, '.lock');

// ---- 涓棿浠?----
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---- 绠€鍗曠殑鏂囦欢閿侊紙闃叉骞跺彂鍐欏叆鎹熷潖鏁版嵁锛?---
function acquireLock() {
  let retries = 0;
  while (retries < 50) {
    try {
      // 鍦?Windows 涓婁娇鐢ㄧ嫭鍗犲垱寤烘潵妯℃嫙閿?      const fd = fs.openSync(LOCK_FILE, 'wx');
      fs.closeSync(fd);
      return true;
    } catch (e) {
      retries++;
      // 绛?50ms 鍐嶈瘯
      const start = Date.now();
      while (Date.now() - start < 50) { /* busy wait */ }
    }
  }
  return false;
}

function releaseLock() {
  try { fs.unlinkSync(LOCK_FILE); } catch (e) { /* 蹇界暐 */ }
}

// ---- 鏁版嵁璇诲啓 ----
function readTickets() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('[ERROR] 璇诲彇鏁版嵁澶辫触:', e.message);
    return [];
  }
}

function writeTickets(tickets) {
  if (!acquireLock()) {
    throw new Error('鏃犳硶鑾峰彇鏂囦欢閿侊紝璇风◢鍚庨噸璇?);
  }
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    // 鍏堝啓涓存椂鏂囦欢锛屽啀鍘熷瓙閲嶅懡鍚?    const tmp = DATA_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(tickets, null, 2), 'utf-8');
    fs.renameSync(tmp, DATA_FILE);
  } finally {
    releaseLock();
  }
}

// ---- API 璺敱 ----

// 鑾峰彇鎵€鏈夊伐鍗?app.get('/api/tickets', (req, res) => {
  try {
    const tickets = readTickets();
    res.json({ success: true, data: tickets });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 鍒涘缓宸ュ崟
app.post('/api/tickets', (req, res) => {
  try {
    const { date, time, store, product, weight, type, deduct, status, demand, extraCost, note, agent } = req.body;
    if (!date || !store || !product) {
      return res.status(400).json({ success: false, error: '鏃ユ湡銆侀棬搴椼€佸晢鍝佷负蹇呭～椤? });
    }
    const tickets = readTickets();
    const ticket = {
      id: 'CS' + (Date.now() % 100000000).toString(36).toUpperCase(),
      date,
      time: time || '08:00',
      store,
      product,
      weight: parseFloat(weight) || 0,
      type: type || '鍏朵粬',
      deduct: parseFloat(deduct) || 0,
      status: status || '寰呰窡杩?,
      demand: demand || '鍏朵粬',
      extraCost: parseFloat(extraCost) || 0,
      note: note || '',
      agent: agent || '',
      createdAt: new Date().toISOString()
    };
    tickets.push(ticket);
    writeTickets(tickets);
    res.json({ success: true, data: ticket });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 缂栬緫宸ュ崟
app.put('/api/tickets/:id', (req, res) => {
  try {
    const tickets = readTickets();
    const idx = tickets.findIndex(t => t.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: '宸ュ崟涓嶅瓨鍦? });
    }
    const old = tickets[idx];
    const { date, time, store, product, weight, type, deduct, status, demand, extraCost, note, agent } = req.body;
    tickets[idx] = {
      ...old,
      date: date || old.date,
      time: time || old.time,
      store: store || old.store,
      product: product !== undefined ? product : old.product,
      weight: weight !== undefined ? parseFloat(weight) || 0 : old.weight,
      type: type || old.type,
      deduct: deduct !== undefined ? parseFloat(deduct) || 0 : old.deduct,
      status: status || old.status,
      demand: demand !== undefined ? demand : old.demand,
      extraCost: extraCost !== undefined ? parseFloat(extraCost) || 0 : old.extraCost,
      note: note !== undefined ? note : old.note,
      agent: agent !== undefined ? agent : old.agent
    };
    writeTickets(tickets);
    res.json({ success: true, data: tickets[idx] });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 鍒犻櫎宸ュ崟
app.delete('/api/tickets/:id', (req, res) => {
  try {
    const tickets = readTickets();
    const idx = tickets.findIndex(t => t.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: '宸ュ崟涓嶅瓨鍦? });
    }
    tickets.splice(idx, 1);
    writeTickets(tickets);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 鎵归噺鍐欏叆绉嶅瓙鏁版嵁锛堥娆″垵濮嬪寲锛?app.post('/api/seed', (req, res) => {
  try {
    const tickets = readTickets();
    if (tickets.length > 0) {
      return res.json({ success: false, error: '宸叉湁鏁版嵁锛屾棤闇€鍒濆鍖?, seeded: false });
    }
    // 浠庤姹備綋涓幏鍙栭棬搴楀拰鍟嗗搧鍒楄〃锛堝墠绔紶鍏ワ級
    const { stores, products } = req.body;
    if (!stores || !products || stores.length === 0 || products.length === 0) {
      return res.status(400).json({ success: false, error: '璇锋彁渚涢棬搴楀拰鍟嗗搧鏁版嵁' });
    }

    const TYPES = ['缂烘枻灏戜袱','璐у搧鎹熷潖','鍝佽川闂','鍙戦敊璐у搧','閰嶉€佸欢璇?,'灏戝彂璐у搧','閫€娆鹃€€璐?,'鍏朵粬'];
    const DEMANDS = ['閫€璐ч€€娆?,'鎹㈣揣','琛ュ彂','浠呴€€娆?,'閬撴瓑瑙ｉ噴','鍏朵粬'];
    const AGENTS = ['鎯?,'钄?,'濠?,'鏋?,'绮?,'鍏朵粬瀹㈡湇'];

    const dates = [];
    for (let d = 1; d <= 25; d++) dates.push('2026-05-' + String(d).padStart(2, '0'));

    const seedTickets = [];
    for (let i = 0; i < 80; i++) {
      const date = dates[Math.floor(Math.random() * dates.length)];
      const h = 6 + Math.floor(Math.random() * 12);
      const m = Math.floor(Math.random() * 60);
      const type = TYPES[Math.floor(Math.random() * 8)];
      const deduct = type === '缂烘枻灏戜袱' ? Math.round(Math.random() * 80 + 20)
        : type === '璐у搧鎹熷潖' ? Math.round(Math.random() * 200 + 50)
        : Math.round(Math.random() * 150 + 10);
      seedTickets.push({
        id: 'CS' + String(i + 1).padStart(4, '0'),
        date,
        time: String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0'),
        store: stores[Math.floor(Math.random() * stores.length)],
        product: products[Math.floor(Math.random() * products.length)],
        weight: +(Math.random() * 50 + 1).toFixed(1),
        type,
        deduct,
        status: Math.random() > 0.2 ? '宸茶В鍐? : (Math.random() > 0.5 ? '寰呰窡杩? : '宸茶浆浜?),
        demand: DEMANDS[Math.floor(Math.random() * DEMANDS.length)],
        extraCost: Math.random() > 0.6 ? Math.round(Math.random() * 80 + 10) : 0,
        note: '',
        agent: AGENTS[Math.floor(Math.random() * AGENTS.length)],
        createdAt: new Date().toISOString()
      });
    }

    writeTickets(seedTickets);
    res.json({ success: true, seeded: true, count: seedTickets.length });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 鍋ュ悍妫€鏌?app.get('/api/health', (req, res) => {
  const tickets = readTickets();
  res.json({
    success: true,
    status: 'running',
    ticketCount: tickets.length,
    uptime: process.uptime()
  });
});

// ---- 鍚姩鏈嶅姟 ----
app.listen(PORT, () => {
  console.log('========================================');
  console.log('  瀹㈣瘔缁熻宸ュ叿 (澶氫汉鍏变韩鐗?');
  console.log('  鏈嶅姟宸插惎鍔? http://localhost:' + PORT);
  console.log('  鏁版嵁鏂囦欢: ' + DATA_FILE);
  console.log('========================================');
});

// 浼橀泤閫€鍑?process.on('SIGTERM', () => {
  releaseLock();
  process.exit(0);
});
process.on('SIGINT', () => {
  releaseLock();
  process.exit(0);
});
