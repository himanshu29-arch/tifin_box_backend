import prisma from "../src/config/prisma";
import bcrypt from "bcrypt";

async function main() {
  console.log("🌱 Seeding database...");

  const passwordHash = await bcrypt.hash("password123", 10);

  /* ---------------- USERS ---------------- */
  const admin = await prisma.user.upsert({
    where: { email: "admin@tifunbox.com" },
    update: {},
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
    update: {},
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
    update: {},
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
    console.log("🍳 Kitchen created");
  } else {
    console.log("🍳 Kitchen already exists");
  }

  /* ---------------- CATEGORIES ---------------- */
  const categoryNames = ["Tiffin", "Dosa", "Cake", "Fried Rice", "Paneer"];

  const categories = await Promise.all(
    categoryNames.map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  console.log(`📦 Categories ensured (${categories.length})`);

  /* ---------------- MENU ITEMS ---------------- */
  const existingMenu = await prisma.menuItem.findFirst();

  if (!existingMenu) {
    const tiffinCategory = categories.find((c) => c.name === "Tiffin")!;
    const paneerCategory = categories.find((c) => c.name === "Paneer")!;

    await prisma.menuItem.createMany({
      data: [
        {
          name: "Veg Thali",
          price: 150,
          foodType: "VEG",
          kitchenId: kitchen.id,
          categoryId: tiffinCategory.id,
          isAvailable: true,
        },
        {
          name: "Paneer Butter Masala",
          price: 180,
          foodType: "VEG",
          kitchenId: kitchen.id,
          categoryId: paneerCategory.id,
          isAvailable: true,
        },
      ],
    });

    console.log("🍽️ Menu items created");
  } else {
    console.log("🍽️ Menu already exists");
  }

  /* ---------------- ADDRESS ---------------- */
  let address = await prisma.address.findFirst({
    where: { userId: customer.id },
  });

  if (!address) {
    address = await prisma.address.create({
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
    console.log("🏠 Address created");
  } else {
    console.log("🏠 Address already exists");
  }

  /* ---------------- ORDER ---------------- */
  const existingOrder = await prisma.order.findFirst();

  if (!existingOrder) {
    const menuItems = await prisma.menuItem.findMany({
      where: { kitchenId: kitchen.id },
    });

    const subtotal = menuItems.reduce((sum, i) => sum + i.price, 0);

    const order = await prisma.order.create({
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

    console.log("📦 Order created:", order.id);
  } else {
    console.log("📦 Order already exists");
  }

  console.log("✅ Seeding completed successfully");
}

main()
  .catch((err) => {
    console.error("❌ Seed failed", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
