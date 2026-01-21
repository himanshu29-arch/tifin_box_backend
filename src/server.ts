import express from "express";
import prisma from "./config/prisma";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import authRoutes from "./modules/auth/auth.routes";

const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", db: "not connected" });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// // Error handler
// app.use((err, _req, res, _next) => {
//   console.error(err);
//   res.status(500).json({ message: "Internal Server Error" });
// });



app.listen(PORT, () => {
  console.log("Server running on port 3000");
});
