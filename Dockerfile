# Використовуємо стабільний Node.js 18
FROM node:18-alpine

# Створюємо робочу директорію
WORKDIR /app

# Копіюємо package.json і package-lock.json
COPY package*.json ./

# Встановлюємо тільки production-залежності
RUN npm install --production

# Копіюємо решту коду
COPY . .

# Виставляємо змінні середовища
ENV NODE_ENV=production

# Запускаємо бота
CMD ["node", "start.js"]
