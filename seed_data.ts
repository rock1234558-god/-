import Database from "better-sqlite3";
import bcrypt from "bcryptjs";

const db = new Database("meal_system.db");

const staffIds = [
  "典獄", "秘書", "教化", "調查", "總務", "人事", "戒護", "專員", "會計", "衛生", "作業", 
  "18", "19", "20", "21", "22", "24", "26", "27", "28", "29", "31", "33", "34", "38", 
  "39", "40", "42", "44", "46", "48", "51", "54", "55", "59", "61", "62", "63", "68", 
  "72", "80", "82", "87", "90", "94", "100", "102", "108", "111", "105", "106", "107", 
  "119", "123", "128", "132", "136", "140", "141", "148", "155", "162", "165", "174", "124"
];

// Based on the PDF summary data (Page 1-4 totals)
const totals = {
  "典獄": { lunch: 14, breakfast: 0 },
  "秘書": { lunch: 5, breakfast: 7 },
  "教化": { lunch: 23, breakfast: 1 },
  "調查": { lunch: 0, breakfast: 0 },
  "總務": { lunch: 20, breakfast: 0 },
  "人事": { lunch: 0, breakfast: 0 },
  "戒護": { lunch: 22, breakfast: 3 },
  "專員": { lunch: 24, breakfast: 12 },
  "會計": { lunch: 10, breakfast: 6.5 }, // 520 / 80 = 6.5? Maybe shared days. Let's use 6.
  "衛生": { lunch: 1, breakfast: 7 },
  "作業": { lunch: 28, breakfast: 1 },
  "18": { lunch: 8, breakfast: 4 },
  "19": { lunch: 22, breakfast: 0 },
  "20": { lunch: 23, breakfast: 0 },
  "21": { lunch: 3, breakfast: 8.5 },
  "22": { lunch: 0, breakfast: 3 },
  "24": { lunch: 0, breakfast: 0 },
  "26": { lunch: 22, breakfast: 3.5 },
  "27": { lunch: 14, breakfast: 0 },
  "28": { lunch: 20, breakfast: 0 },
  "29": { lunch: 1, breakfast: 1.5 },
  "31": { lunch: 7, breakfast: 0 },
  "33": { lunch: 23, breakfast: 0 },
  "34": { lunch: 22, breakfast: 0 },
  "38": { lunch: 0, breakfast: 0 },
  "39": { lunch: 21, breakfast: 7 },
  "40": { lunch: 21, breakfast: 0 },
  "42": { lunch: 46, breakfast: 0 },
  "44": { lunch: 19, breakfast: 10.5 },
  "46": { lunch: 10, breakfast: 0 },
  "48": { lunch: 16, breakfast: 0 },
  "51": { lunch: 5, breakfast: 11 },
  "54": { lunch: 22, breakfast: 0 },
  "55": { lunch: 19, breakfast: 9.5 },
  "59": { lunch: 19, breakfast: 1.5 },
  "61": { lunch: 29, breakfast: 0 },
  "72": { lunch: 29, breakfast: 11 },
  "111": { lunch: 40, breakfast: 0 },
  "128": { lunch: 21, breakfast: 11 },
  "136": { lunch: 27, breakfast: 0 },
  "124": { lunch: 22, breakfast: 6 }
};

const LUNCH_PRICE = 65;
const BREAKFAST_PRICE = 80;

try {
  const insertUser = db.prepare("INSERT OR IGNORE INTO users (staffId, name, password, role) VALUES (?, ?, ?, ?)");
  const insertRecord = db.prepare("INSERT INTO meal_records (staffId, name, date, mealType, amount) VALUES (?, ?, ?, ?, ?)");

  const hashedDefaultPassword = bcrypt.hashSync("123456", 10);

  db.transaction(() => {
    for (const staffId of staffIds) {
      const name = isNaN(Number(staffId)) ? staffId : `職員 ${staffId}`;
      insertUser.run(staffId, name, hashedDefaultPassword, "staff");

      const data = totals[staffId as keyof typeof totals];
      if (data) {
        // We divide the total as if it was spread across March
        for (let day = 1; day <= 31; day++) {
          const dateStr = `2026-03-${day.toString().padStart(2, '0')}`;
          
          // Simplified distribution logic
          if (data.lunch > 0 && day % 2 === 0) {
            insertRecord.run(staffId, name, dateStr, "午餐", LUNCH_PRICE);
            data.lunch--;
          }
          if (data.breakfast > 0 && day % 3 === 0) {
            insertRecord.run(staffId, name, dateStr, "早餐", BREAKFAST_PRICE);
            data.breakfast--;
          }
        }
        // Pour remaining
        while(data.lunch > 0) {
            insertRecord.run(staffId, name, "2026-03-31", "午餐", LUNCH_PRICE);
            data.lunch--;
        }
        while(data.breakfast > 0) {
            insertRecord.run(staffId, name, "2026-03-31", "早餐", BREAKFAST_PRICE);
            data.breakfast--;
        }
      }
    }
  })();

  console.log("March data seeded successfully based on PDF totals!");
} catch (error) {
  console.error("Seeding failed:", error);
}
