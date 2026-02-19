import prisma from "../src/config/prisma";
import bcrypt from "bcrypt";

async function main() {
  console.log("🌱 Seeding database (CLEAN + IMAGE MODE)...");

  const passwordHash = await bcrypt.hash("Password123", 12);

  /* ================= USERS ================= */

  const admin = await prisma.user.upsert({
    where: { email: "admin@tifunbox.com" },
    update: { passwordHash, role: "ADMIN", isActive: true },
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
    update: { passwordHash, role: "CHEF", isActive: true },
    create: {
      name: "Test Chef",
      email: "chef@tifunbox.com",
      phone: "9222222222",
      role: "CHEF",
      passwordHash,
      isActive: true,
    },
  });

  const delivery = await prisma.user.upsert({
    where: { email: "delivery@tifunbox.com" },
    update: { passwordHash, role: "DELIVERY_AGENT", isActive: true },
    create: {
      name: "Delivery Agent",
      email: "delivery@tifunbox.com",
      phone: "9333333333",
      role: "DELIVERY_AGENT",
      passwordHash,
      isActive: true,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@tifunbox.com" },
    update: { passwordHash, role: "CUSTOMER", isActive: true },
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
        imageUrl:
          "https://storage.googleapis.com/tifunbox-test-bucket/kitchen/sample-kitchen.png",
        latitude: 20.2961,
        longitude: 85.8245,
        address: "Delhi, India",
      },
    });
  }

  console.log("🍳 Kitchen ensured");

  /* ================= CATEGORIES (KEEP EXISTING) ================= */

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

  const tiffinCategory = categories.find(c => c.name === "Tiffin")!;
  const paneerCategory = categories.find(c => c.name === "Paneer")!;

  /* ================= CLEAN RELATIONS ================= */

  console.log("🧹 Cleaning menu & order data...");

  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.address.deleteMany({ where: { userId: customer.id } });

  console.log("🗑 Menu + Order cleaned");

  /* ================= MENU WITH IMAGE + NUTRITION ================= */

  const vegThali = await prisma.menuItem.create({
    data: {
      name: "Veg Thali Deluxe",
      description: "Full home style veg meal with dal, sabji, rice & roti",
      price: 200,
      foodType: "VEG",
      tiffinSize: "FULL",
      imageUrl:
        "https://e7.pngegg.com/pngimages/692/99/png-clipart-delicious-food-food-salad-thumbnail.png",
      kitchenId: kitchen.id,
      categoryId: tiffinCategory.id,
      isAvailable: true,
      nutrition: {
        create: [
          { key: "Calories", value: "450", unit: "kcal" },
          { key: "Protein", value: "18", unit: "g" },
        ],
      },
    },
  });

  const paneerItem = await prisma.menuItem.create({
    data: {
      name: "Paneer Butter Masala",
      description: "Rich creamy paneer curry",
      price: 180,
      foodType: "VEG",
      imageUrl:
        "https://png.pngtree.com/png-vector/20231211/ourmid/pngtree-group-of-fast-food-products-png-image_11219877.png",
      kitchenId: kitchen.id,
      categoryId: paneerCategory.id,
      isAvailable: true,
    },
  });

  console.log("🍽 Menu created with images");

  /* ================= ADDRESS ================= */

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

  console.log("🏠 Address created");

  /* ================= ORDER ================= */

  const subtotal = vegThali.price;

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
        create: [
          {
            menuItemId: vegThali.id,
            quantity: 1,
            price: vegThali.price,
          },
        ],
      },
      payment: {
        create: {
          mode: "COD",
          status: "PENDING",
        },
      },
    },
  });

  console.log("📦 Test order created:", order.id);

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
