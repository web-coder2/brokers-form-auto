FROM node:20-slim

WORKDIR /app

COPY client/ ./client
COPY server/ ./server
COPY package.json package.json

RUN npm install

EXPOSE 5000
EXPOSE 3000

CMD ["npm", "start"]