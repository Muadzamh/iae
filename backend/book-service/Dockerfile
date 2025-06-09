# backend/book-service/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY config ./config
COPY book-service ./book-service
EXPOSE 3002
CMD ["node", "book-service/app.js"]