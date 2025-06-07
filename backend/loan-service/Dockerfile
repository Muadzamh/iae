# backend/loan-service/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY config ./config
COPY loan-service ./loan-service
EXPOSE 3003
CMD ["node", "loan-service/app.js"]