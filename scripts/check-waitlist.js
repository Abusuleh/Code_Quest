const { PrismaClient } = require("@prisma/client");
(async () => {
  const prisma = new PrismaClient();
  const row = await prisma.waitlist.findUnique({
    where: { email: "test.waitlist@codequest.world" },
  });
  console.log(row ? JSON.stringify(row) : "not_found");
  await prisma.$disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
