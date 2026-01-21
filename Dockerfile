FROM node:20-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma client (code only)
RUN npm run prisma:generate

# Build TypeScript
RUN npm run build

EXPOSE 3000

# 🔥 Run migrations FIRST, then start app
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
