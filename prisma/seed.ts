import prisma from "../src/config/prisma";
import bcrypt from "bcrypt";

async function main() {
  console.log("🌱 Seeding database (force-safe)...");

  const passwordHash = await bcrypt.hash("password123", 10);

  /* ================= USERS ================= */

  const admin = await prisma.user.upsert({
    where: { email: "admin@tifunbox.com" },
    update: {
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
    create: {
      name: "Admin",
      email: "admin@tifunbox.com",
      phone: "9000000000",
      role: "ADMIN",
      passwordHash,
      isActive: true,
    },
  });

  const chef = await prisma.user.upsert({
    where: { email: "chef@tifunbox.com" },
    update: {
      passwordHash,
      role: "CHEF",
      isActive: true,
    },
    create: {
      name: "Test Chef",
      email: "chef@tifunbox.com",
      phone: "9222222222",
      role: "CHEF",
      passwordHash,
      isActive: true,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@tifunbox.com" },
    update: {
      passwordHash,
      role: "CUSTOMER",
      isActive: true,
    },
    create: {
      name: "Test Customer",
      email: "customer@tifunbox.com",
      phone: "9111111111",
      role: "CUSTOMER",
      passwordHash,
      isActive: true,
    },
  });

  console.log("👥 Users ensured");

  /* ================= KITCHEN ================= */

let kitchen = await prisma.kitchen.findFirst({
  where: { name: "TifunBox Central Kitchen" },
});

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
  console.log("🍳 Kitchen created");
} else {
  kitchen = await prisma.kitchen.update({
    where: { id: kitchen.id },
    data: {
      type: "VEG",
      imageUrl: "https://storage.googleapis.com/demo/kitchen.png",
      latitude: 20.2961,
      longitude: 85.8245,
      address: "Bhubaneswar, Odisha",
    },
  });
  console.log("🍳 Kitchen updated");
}


  console.log("🍳 Kitchen ensured");

  /* ================= CATEGORIES ================= */

  const categoryNames = ["Tiffin", "Dosa", "Cake", "Fried Rice", "Paneer"];

  const categories = await Promise.all(
    categoryNames.map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  console.log("📦 Categories ensured");

  /* ================= MENU ================= */

  await prisma.menuItem.deleteMany(); // 🔥 important for clean menu

  await prisma.menuItem.createMany({
    data: [
      {
        name: "Veg Thali",
        price: 150,
        foodType: "VEG",
        kitchenId: kitchen.id,
        categoryId: categories.find((c) => c.name === "Tiffin")!.id,
        isAvailable: true,
      },
      {
        name: "Paneer Butter Masala",
        price: 180,
        foodType: "VEG",
        kitchenId: kitchen.id,
        categoryId: categories.find((c) => c.name === "Paneer")!.id,
        isAvailable: true,
      },
    ],
  });

  console.log("🍽️ Menu ensured");

  /* ================= ADDRESS ================= */

  await prisma.address.deleteMany({ where: { userId: customer.id } });

  const address = await prisma.address.create({
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

  console.log("🏠 Address ensured");

  /* ================= ORDER ================= */

  await prisma.order.deleteMany();

  const menuItems = await prisma.menuItem.findMany();

  const subtotal = menuItems.reduce((sum, i) => sum + i.price, 0);

  await prisma.order.create({
    data: {
      userId: customer.id,
      kitchenId: kitchen.id,
      addressId: address.id,
      status: "PLACED",
      subtotal,
      totalAmount: subtotal,
      paymentMode: "COD",
      items: {
        create: menuItems.map((item) => ({
          menuItemId: item.id,
          quantity: 1,
          price: item.price,
        })),
      },
      payment: {
        create: {
          mode: "COD",
          status: "PENDING",
        },
      },
    },
  });

  console.log("📦 Order ensured");
  console.log("✅ Seed completed successfully");
}

main()
  .catch((err) => {
    console.error("❌ Seed failed", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
