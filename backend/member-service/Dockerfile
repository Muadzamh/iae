# backend/member-service/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY config ./config
COPY member-service ./member-service
EXPOSE 3001
CMD ["node", "member-service/app.js"]