FROM node:20-slim

WORKDIR /app

# 🔑 Install OpenSSL (THIS IS REQUIRED FOR PRISMA)
RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run prisma:generate

EXPOSE 3000

CMD ["npm", "run", "dev"]
