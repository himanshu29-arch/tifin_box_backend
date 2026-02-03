import prisma from "../src/config/prisma";
import bcrypt from "bcrypt";

async function main() {
  console.log("🌱 Seeding database...");

  /* 🔐 ONE-TIME GUARD (VERY IMPORTANT) */
  const existingKitchen = await prisma.kitchen.findFirst();
  if (existingKitchen) {
    console.log("⚠️ Seed already applied. Skipping...");
    return;
  }

  /* ---------------- USERS ---------------- */
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@tifunbox.com",
      phone: "9000000000",
      role: "ADMIN",
      passwordHash,
      isActive: true,
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "Test Customer",
      email: "customer@tifunbox.com",
      phone: "9111111111",
      role: "CUSTOMER",
      passwordHash,
      isActive: true,
    },
  });

  /* ---------------- KITCHEN ---------------- */
let kitchen = await prisma.kitchen.findFirst();

if (!kitchen) {
  kitchen = await prisma.kitchen.create({
    data: {
      name: "TifunBox Central Kitchen",
      description: "Home style daily tiffin service",
      type: "VEG",
      imageUrl: "https://storage.googleapis.com/demo/kitchen.png",
      latitude: 20.2961,
      longitude: 85.8245,
      address: "Bhubaneswar, Odisha",
    },
  });
}



  /* ---------------- CATEGORIES ---------------- */
const categories = await Promise.all(
  ["Tiffin", "Dosa", "Cake", "Fried Rice", "Paneer"].map(name =>
    prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  )
);

  /* ---------------- MENU ITEMS ---------------- */
await prisma.menuItem.create({
  data: {
    name: "Veg Thali",
    price: 150,
    foodType: "VEG",
    kitchenId: kitchen.id,
    categoryId: categories[0].id,
    isAvailable: true,
  },
});


  /* ---------------- ADDRESS ---------------- */
await prisma.address.create({
  data: {
    userId: customer.id,
    receiverName: "Test Customer",
    contactNumber: "9111111111",
    houseNumber: "A-203",
    sector: "Sector 21",
    postcode: "751024",
    latitude: 20.2961,
    longitude: 85.8245,
    type: "HOME",
    isDefault: true,
  },
});


  console.log("✅ Seeding completed successfully");
}

main()
  .catch(err => {
    console.error("❌ Seed failed", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
