import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const achievements = [
  {
    key: "FIRST_LESSON",
    title: "First Quest",
    description: "Complete your first lesson.",
    iconUrl: "/achievements/first-lesson.png",
    xpReward: 50,
    gemReward: 10,
    rarity: "COMMON",
  },
  {
    key: "STREAK_3",
    title: "On Fire",
    description: "Maintain a 3-day streak.",
    iconUrl: "/achievements/streak-3.png",
    xpReward: 50,
    gemReward: 10,
    rarity: "COMMON",
  },
  {
    key: "STREAK_7",
    title: "Week Warrior",
    description: "Maintain a 7-day streak.",
    iconUrl: "/achievements/streak-7.png",
    xpReward: 100,
    gemReward: 25,
    rarity: "RARE",
  },
  {
    key: "STREAK_30",
    title: "Unstoppable",
    description: "Maintain a 30-day streak.",
    iconUrl: "/achievements/streak-30.png",
    xpReward: 300,
    gemReward: 75,
    rarity: "EPIC",
  },
  {
    key: "LEVEL_5",
    title: "Rising Star",
    description: "Reach level 5.",
    iconUrl: "/achievements/level-5.png",
    xpReward: 50,
    gemReward: 10,
    rarity: "COMMON",
  },
  {
    key: "LEVEL_10",
    title: "Code Knight",
    description: "Reach level 10.",
    iconUrl: "/achievements/level-10.png",
    xpReward: 150,
    gemReward: 30,
    rarity: "RARE",
  },
  {
    key: "LEVEL_20",
    title: "Code Legend",
    description: "Reach level 20.",
    iconUrl: "/achievements/level-20.png",
    xpReward: 500,
    gemReward: 150,
    rarity: "LEGENDARY",
  },
  {
    key: "XP_1000",
    title: "First Thousand",
    description: "Earn 1,000 XP.",
    iconUrl: "/achievements/xp-1000.png",
    xpReward: 50,
    gemReward: 10,
    rarity: "COMMON",
  },
  {
    key: "XP_10000",
    title: "Ten Thousand Club",
    description: "Earn 10,000 XP.",
    iconUrl: "/achievements/xp-10000.png",
    xpReward: 150,
    gemReward: 30,
    rarity: "RARE",
  },
  {
    key: "PERFECT_LESSON",
    title: "Perfectionist",
    description: "Score 100% on a lesson.",
    iconUrl: "/achievements/perfect-lesson.png",
    xpReward: 100,
    gemReward: 20,
    rarity: "RARE",
  },
  {
    key: "PLACEMENT_DONE",
    title: "Kingdom Found",
    description: "Complete the placement adventure.",
    iconUrl: "/achievements/placement.png",
    xpReward: 50,
    gemReward: 10,
    rarity: "COMMON",
  },
  {
    key: "FIRST_CHILD",
    title: "Profile Created",
    description: "Parent creates the first child profile.",
    iconUrl: "/achievements/first-child.png",
    xpReward: 0,
    gemReward: 0,
    rarity: "COMMON",
  },
];

async function main() {
  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { key: achievement.key },
      update: {
        title: achievement.title,
        description: achievement.description,
        iconUrl: achievement.iconUrl,
        xpReward: achievement.xpReward,
        gemReward: achievement.gemReward,
        rarity: achievement.rarity as never,
      },
      create: {
        key: achievement.key,
        title: achievement.title,
        description: achievement.description,
        iconUrl: achievement.iconUrl,
        xpReward: achievement.xpReward,
        gemReward: achievement.gemReward,
        rarity: achievement.rarity as never,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
