FROM node:20-slim

# Создаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json (если есть) из корня
COPY package.json package-lock.json* ./

# Устанавливаем зависимости для всего проекта
RUN npm install

# Копируем папки client и server
COPY client/ ./client
COPY server/ ./server

# Открываем нужные порты
EXPOSE 3000 5000

# Запускаем команду для разработки (через npm run dev в корне)
CMD ["npm", "run", "dev"]