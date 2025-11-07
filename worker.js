import fs from "fs";
import TelegramBot from "node-telegram-bot-api";
import "dotenv/config";

const token = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;
const bot = new TelegramBot(token, { polling: false });

const TASKS_FILE = "./tasks.json";
const STOP_FILE = "./stop.flag";

function loadTasks() {
  if (!fs.existsSync(TASKS_FILE)) return [];
  const data = fs.readFileSync(TASKS_FILE, "utf8");
  return data ? JSON.parse(data) : [];
}

function saveTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

async function runWorker() {
  console.log("👷‍♂️ Worker запущений...");
  await bot.sendMessage(chatId, "👷‍♂️ Воркер запущений і готовий до роботи.");

  while (true) {
    if (fs.existsSync(STOP_FILE)) {
      console.log("🛑 Worker зупинено користувачем.");
      await bot.sendMessage(chatId, "🛑 Воркер зупинено користувачем.");
      fs.unlinkSync(STOP_FILE);
      process.exit(0);
    }

    const tasks = loadTasks();
    const pending = tasks.find((t) => t.status === "pending");

    if (pending) {
      console.log(`🔄 Виконую задачу: ${pending.command}`);
      pending.status = "in_progress";
      saveTasks(tasks);

      await new Promise((res) => setTimeout(res, 5000)); // симуляція виконання

      pending.status = "done";
      saveTasks(tasks);

      await bot.sendMessage(chatId, `✅ Задача виконана:\n"${pending.command}"`);
      console.log(`✅ Задача виконана: ${pending.command}`);
    } else {
      await new Promise((res) => setTimeout(res, 3000));
    }
  }
}

runWorker();
