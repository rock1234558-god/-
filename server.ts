import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import multer from "multer";
import * as xlsx from "xlsx";
import { parse as parseCsv } from "csv-parse/sync";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("meal_system.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    staffId TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'staff'))
  );

  CREATE TABLE IF NOT EXISTS meal_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    staffId TEXT NOT NULL,
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    mealType TEXT NOT NULL,
    amount REAL NOT NULL,
    FOREIGN KEY (staffId) REFERENCES users(staffId)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  INSERT OR IGNORE INTO settings (key, value) VALUES ('breakfast_price', '40');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('lunch_price', '65');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('dinner_price', '65');
`);

// Add initial admin if not exists
const adminCount = db.prepare("SELECT count(*) as count FROM users WHERE role = 'admin'").get() as { count: number };
if (adminCount.count === 0) {
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare("INSERT INTO users (staffId, name, password, role) VALUES (?, ?, ?, ?)").run("admin", "系統管理員", hashedPassword, "admin");
}

const app = express();
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// --- SETTINGS ENDPOINTS ---

app.get("/api/settings", (req, res) => {
  const settings = db.prepare("SELECT * FROM settings").all() as { key: string, value: string }[];
  const formatted = settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});
  res.json(formatted);
});

app.post("/api/settings", (req, res) => {
  const { breakfast_price, lunch_price, dinner_price } = req.body;
  const update = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
  
  db.transaction(() => {
    update.run('breakfast_price', breakfast_price);
    update.run('lunch_price', lunch_price);
    update.run('dinner_price', dinner_price);
  })();
  
  res.json({ success: true });
});

// --- ADMIN ENDPOINTS ---

app.get("/api/admin/summary", (req, res) => {
  const monthStr = req.query.month as string; // YYYY-MM
  if (!monthStr) return res.status(400).json({ error: "Missing month" });

  const summary = db.prepare(`
    SELECT 
      u.staffId, 
      u.name,
      SUM(CASE WHEN m.mealType LIKE '%早餐%' THEN 1 ELSE 0 END) as breakfastCount,
      SUM(CASE WHEN m.mealType LIKE '%午餐%' THEN 1 ELSE 0 END) as lunchCount,
      SUM(CASE WHEN m.mealType LIKE '%晚餐%' THEN 1 ELSE 0 END) as dinnerCount
    FROM users u
    LEFT JOIN meal_records m ON u.staffId = m.staffId AND m.date LIKE ?
    GROUP BY u.staffId
  `).all(`${monthStr}%`);

  res.json(summary);
});

// --- AUTH ENDPOINTS ---

app.post("/api/login", (req, res) => {
  const { staffId, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE staffId = ?").get(staffId) as any;

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "職員編號或密碼錯誤" });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

app.post("/api/register", (req, res) => {
  const { staffId, name, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.prepare("INSERT INTO users (staffId, name, password, role) VALUES (?, ?, ?, ?)").run(staffId, name, hashedPassword, "staff");
    res.json({ success: true });
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: "該職員編號已存在" });
    }
    res.status(500).json({ error: "註冊失敗" });
  }
});

// --- ADMIN ENDPOINTS ---

app.get("/api/admin/users", (req, res) => {
  const users = db.prepare("SELECT staffId, name, role FROM users").all();
  res.json(users);
});

app.post("/api/admin/reset-password", (req, res) => {
  const { staffId, newPassword } = req.body;
  const hashedPassword = bcrypt.hashSync(newPassword, 10);
  db.prepare("UPDATE users SET password = ? WHERE staffId = ?").run(hashedPassword, staffId);
  res.json({ success: true });
});

app.post("/api/admin/upload-data", upload.single("file"), (req: any, res) => {
  if (!req.file) return res.status(400).json({ error: "未上傳檔案" });

  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

    if (data.length < 2) throw new Error("無效的資料格式");

    const headers = data[0]; // Header row: ID, Name, Date1, Date2, ...
    const rows = data.slice(1);

    const transaction = db.transaction((records: any[]) => {
      // For simplicity, we clear records when uploading new data (as requested: "覆蓋或更新")
      // But typically we might want to clear only the month being uploaded.
      // Here I will clear ALL for a fresh start, or we could filter by date.
      db.prepare("DELETE FROM meal_records").run(); 

      const insert = db.prepare(`
        INSERT INTO meal_records (staffId, name, date, mealType, amount)
        VALUES (?, ?, ?, ?, ?)
      `);

      for (const row of records) {
        const staffId = row[0];
        const name = row[1];
        
        for (let i = 2; i < headers.length; i++) {
          const dateStr = headers[i];
          const mealContent = row[i];

          if (mealContent) {
            // Logic to extract amount if present like "午餐(80)"
            const match = mealContent.toString().match(/\((\d+)\)/);
            const amount = match ? parseInt(match[1]) : 80; // Default 80 if not specified
            const mealType = mealContent.toString().replace(/\(\d+\)/, "").trim();

            insert.run(staffId.toString(), name, dateStr.toString(), mealType, amount);
          }
        }
      }
    });

    transaction(rows);
    res.json({ success: true, count: rows.length });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "資料解析失敗: " + error.message });
  }
});

// --- STAFF ENDPOINTS ---

app.get("/api/my-records", (req, res) => {
  const staffId = req.query.staffId as string;
  if (!staffId) return res.status(400).json({ error: "Missing staffId" });

  const records = db.prepare(`
    SELECT * FROM meal_records 
    WHERE staffId = ? 
    ORDER BY date DESC
  `).all(staffId);

  const totalAmount = db.prepare(`
    SELECT SUM(amount) as total FROM meal_records 
    WHERE staffId = ?
  `).get(staffId) as { total: number };

  res.json({ records, totalAmount: totalAmount.total || 0 });
});

// --- SERVER SETUP ---

async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
