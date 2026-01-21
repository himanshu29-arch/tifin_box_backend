# 🍱 TifunBox Backend

Backend service for **TifunBox**, a tiffin-based food ordering platform.  
Built using **Node.js, TypeScript, Express, PostgreSQL, and Prisma**.

This backend is designed as a **market-ready MVP**, not a demo or academic project.  
It follows clean architecture and is scalable for future features like subscriptions, riders, and automated settlements.

---

## 🛠 Tech Stack

- Node.js (v20 recommended)
- TypeScript
- Express
- PostgreSQL (v15 recommended)
- Prisma ORM (v5)
- ts-node
- nodemon

---

## 📁 Project Structure

```bash
tifunbox-backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── server.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── orderController.ts
│   │   └── userController.ts
│   ├── models/
│   │   ├── Order.ts
│   │   └── User.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── orderRoutes.ts
│   │   └── userRoutes.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── orderService.ts
│   │   └── userService.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   └── helpers.ts
│   ├── index.ts
│   └── prisma.ts
├── .env.example
├── package.json
├── tsconfig.json
└── nodemon.json
```

---


---

## ✅ Prerequisites

Ensure the following are installed:

- **Node.js v20**
- **PostgreSQL v15**
- **npm**
- **Homebrew (macOS)**

Check versions:
```bash
node -v
psql --version
npm -v
```

---

## Create postgresql DB 
brew services start postgresql@15
psql postgres
CREATE DATABASE tifunbox_db;
\q


## Set Database Ownership (IMPORTANT)

psql postgres
\c tifunbox_db
ALTER DATABASE tifunbox_db OWNER TO <your-mac-username>;
ALTER SCHEMA public OWNER TO <your-mac-username>;
GRANT ALL PRIVILEGES ON DATABASE tifunbox_db TO <your-mac-username>;
\q
DATABASE_URL=postgresql://<your-mac-username>@localhost:5432/tifunbox_db

psql tifunbox_db
\dt

## Prisma Studio UI
npx prisma studio

## Project Start
npm install

## Generate Prisma Client
npx prisma generate

## Run Database Migration
npx prisma migrate dev --name init
npx prisma migrate dev --name add_email_otp_auth

npx ts-node src/server.ts

npm install
npx prisma generate
npx prisma migrate dev
npx ts-node src/server.ts

## 🧪 Development Scripts

Common commands:

```bash
npm run dev            # Start server with nodemon
npm run build          # Compile TypeScript to dist/
npm start              # Run compiled server
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio  # Open Prisma DB UI

## 🐳 Docker Setup (Recommended)

This project supports Docker for easy setup on any system.

### Prerequisites
- Docker
- Docker Compose

### Start backend + database
```bash
docker compose up --build


docker compose exec backend npx prisma migrate dev --name init
docker compose down
docker compose up
http://localhost:3000/health


## 6️⃣ How any developer will run this (IMPORTANT)

They just do 👇

```bash
git clone <repo>
cd tifunbox-backend
docker compose up --build
docker compose exec backend npx prisma migrate dev



Swagger docs at http://localhost:3000/api-docs