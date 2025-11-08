# Використовуємо офіційний образ Node.js
FROM node:18

# Створюємо робочу директорію
WORKDIR /app

# Копіюємо файли package.json і package-lock.json (якщо є)
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо весь код
COPY . .

# Виставляємо змінну середовища
ENV NODE_ENV=production

# Запускаємо бот
CMD ["node", "start.js"]
