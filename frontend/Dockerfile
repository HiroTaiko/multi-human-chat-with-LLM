FROM node:18-alpine
WORKDIR /app

# npmベースに修正
COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

CMD ["npm", "start"]