import { spawn } from "child_process";

console.log("🚀 Запускаю Telegram Assistant...");

// Запускаємо бота
const bot = spawn("node", ["bot.js"], { stdio: "inherit" });

// Запускаємо воркер
const worker = spawn("node", ["worker.js"], { stdio: "inherit" });

// Логи завершення
bot.on("close", (code) => {
  console.log(`🤖 Бот завершив роботу з кодом ${code}`);
});

worker.on("close", (code) => {
  console.log(`👷‍♂️ Воркер завершив роботу з кодом ${code}`);
});
