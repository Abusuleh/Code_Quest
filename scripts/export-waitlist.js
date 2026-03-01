const { PrismaClient } = require("@prisma/client");
(async () => {
  const prisma = new PrismaClient();
  const rows = await prisma.waitlist.findMany({ orderBy: { createdAt: "desc" }, take: 5 });
  console.log(JSON.stringify(rows, null, 2));
  await prisma.$disconnect();
})();
