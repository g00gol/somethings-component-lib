FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p /app/.expo && chmod -R 777 /app/.expo

EXPOSE 8081 19000 19001

CMD ["npx", "expo", "start", "--tunnel"]
