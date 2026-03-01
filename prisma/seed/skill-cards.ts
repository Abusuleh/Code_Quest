import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const skillCards = [
  {
    id: "scratch-basics",
    name: "Scratch Basics",
    description: "Block coding fundamentals.",
    rarity: "COMMON",
    phase: 1,
    skill: "Scratch",
  },
  {
    id: "loops-forever",
    name: "Loop Forever",
    description: "Using forever and repeat loops.",
    rarity: "COMMON",
    phase: 1,
    skill: "Scratch",
  },
  {
    id: "if-blocks",
    name: "If Blocks",
    description: "Conditional logic in Scratch.",
    rarity: "UNCOMMON",
    phase: 1,
    skill: "Scratch",
  },
  {
    id: "sprite-control",
    name: "Sprite Master",
    description: "Movement and costume control.",
    rarity: "COMMON",
    phase: 1,
    skill: "Scratch",
  },
  {
    id: "sound-effects",
    name: "Sound Sorcerer",
    description: "Sound blocks and music.",
    rarity: "COMMON",
    phase: 1,
    skill: "Scratch",
  },
  {
    id: "python-hello",
    name: "Hello Python",
    description: "First Python program.",
    rarity: "COMMON",
    phase: 1,
    skill: "Python",
  },
  {
    id: "variables-python",
    name: "Variable Vault",
    description: "Python variables and types.",
    rarity: "UNCOMMON",
    phase: 1,
    skill: "Python",
  },
  {
    id: "python-loops",
    name: "Python Loops",
    description: "for and while loops.",
    rarity: "UNCOMMON",
    phase: 1,
    skill: "Python",
  },
  {
    id: "python-functions",
    name: "Function Forge",
    description: "Defining and calling functions.",
    rarity: "RARE",
    phase: 1,
    skill: "Python",
  },
  {
    id: "python-lists",
    name: "List Wizard",
    description: "Python lists and indexing.",
    rarity: "RARE",
    phase: 1,
    skill: "Python",
  },
  {
    id: "html-structure",
    name: "HTML Hero",
    description: "Document structure and tags.",
    rarity: "COMMON",
    phase: 2,
    skill: "HTML",
  },
  {
    id: "css-style",
    name: "Style Sage",
    description: "CSS selectors and properties.",
    rarity: "COMMON",
    phase: 2,
    skill: "CSS",
  },
  {
    id: "flexbox-master",
    name: "Flexbox Master",
    description: "CSS Flexbox layouts.",
    rarity: "UNCOMMON",
    phase: 2,
    skill: "CSS",
  },
  {
    id: "js-intro",
    name: "JS Spark",
    description: "JavaScript basics.",
    rarity: "COMMON",
    phase: 2,
    skill: "JavaScript",
  },
  {
    id: "dom-wizard",
    name: "DOM Wizard",
    description: "Selecting and changing elements.",
    rarity: "UNCOMMON",
    phase: 2,
    skill: "JavaScript",
  },
  {
    id: "events-master",
    name: "Event Handler",
    description: "Click and keyboard events.",
    rarity: "RARE",
    phase: 2,
    skill: "JavaScript",
  },
  {
    id: "project-builder",
    name: "Project Builder",
    description: "Complete your first project.",
    rarity: "RARE",
    phase: 2,
    skill: "Projects",
  },
  {
    id: "debugger",
    name: "The Debugger",
    description: "Find and fix bugs.",
    rarity: "RARE",
    phase: 2,
    skill: "Debugging",
  },
  {
    id: "code-master",
    name: "Code Master",
    description: "Master all Phase 1 skills.",
    rarity: "HOLO",
    phase: 1,
    skill: "Meta",
    isHolo: true,
  },
  {
    id: "web-architect",
    name: "Web Architect",
    description: "Master all Phase 2 skills.",
    rarity: "LEGENDARY",
    phase: 2,
    skill: "Meta",
    isHolo: true,
  },
];

async function main() {
  for (const card of skillCards) {
    await prisma.skillCard.upsert({
      where: { id: card.id },
      update: {
        name: card.name,
        description: card.description,
        rarity: card.rarity as never,
        phase: card.phase,
        skill: card.skill,
        artworkUrl: `/cards/${card.id}.png`,
        isHolo: card.isHolo ?? false,
      },
      create: {
        id: card.id,
        name: card.name,
        description: card.description,
        rarity: card.rarity as never,
        phase: card.phase,
        skill: card.skill,
        artworkUrl: `/cards/${card.id}.png`,
        isHolo: card.isHolo ?? false,
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
