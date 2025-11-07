import TelegramBot from "node-telegram-bot-api";
import fs from "fs";
import { spawn } from "child_process";
import "dotenv/config";

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const TASKS_FILE = "./tasks.json";

// Функції для роботи з задачами
function loadTasks() {
  if (!fs.existsSync(TASKS_FILE)) return [];
  const data = fs.readFileSync(TASKS_FILE, "utf8");
  return data ? JSON.parse(data) : [];
}

function saveTask(task) {
  const tasks = loadTasks();
  tasks.push(task);
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

// Основна логіка
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.trim();

  // /start
  if (text === "/start") {
    bot.sendMessage(
      chatId,
      "👋 Привіт! Я — Twitter Assistant.\n\n📋 Команди:\n" +
        "• Надішли задачу — я її збережу\n" +
        "• /tasks — переглянути список задач\n" +
        "• /stop — зупинити воркер\n" +
        "• /resume — запустити воркер знову"
    );
    return;
  }

  // /tasks
  if (text === "/tasks") {
    const tasks = loadTasks();
    if (tasks.length === 0) {
      bot.sendMessage(chatId, "📭 Зараз немає жодної задачі.");
      return;
    }

    let message = "📋 *Список задач:*\n\n";
    for (const t of tasks) {
      const icon =
        t.status === "done"
          ? "✅"
          : t.status === "in_progress"
          ? "🕓"
          : "🟢";
      message += `${icon} ${t.command}\n`;
    }

    bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
    return;
  }

  // створення задач
  if (/^створи/i.test(text)) {
    const task = {
      id: Date.now(),
      command: text,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    saveTask(task);
    bot.sendMessage(chatId, `✅ Задача додана у список:\n"${text}"`);
    return;
  }

  // /stop — сигнал на зупинку воркера
  if (text === "/stop") {
    fs.writeFileSync("./stop.flag", "STOP");
    bot.sendMessage(chatId, "🛑 Зупиняю воркер...");
    return;
  }

  // /resume — перезапуск воркера
  if (text === "/resume") {
    bot.sendMessage(chatId, "🔁 Запускаю воркер знову...");
    const worker = spawn("node", ["worker.js"], { detached: true, stdio: "ignore" });
    worker.unref();
    return;
  }

  // Повідомлення за замовчуванням
  bot.sendMessage(
    chatId,
    "ℹ️ Надішли задачу у форматі:\n'створи 5 груп по 180 учасників'\n" +
      "або скористайся командами /tasks, /stop, /resume."
  );
});
