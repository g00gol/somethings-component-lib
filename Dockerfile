FROM node:18-bullseye

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install -g expo-cli @expo/ngrok && npm install

COPY . .

EXPOSE 8081 19000 19001 19002

CMD ["npx", "expo", "start", "--tunnel", "--no-dev", "--clear", "--max-workers", "1"]
