import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type LessonSeed = {
  id: string;
  moduleId: string;
  order: number;
  title: string;
  type: "STORY" | "CODING" | "CHALLENGE" | "PROJECT";
  xpReward: number;
  gemReward: number;
  content: {
    type: "story" | "coding" | "challenge" | "project";
    objective: string;
    hint: string;
    successCondition: string;
  };
};

const estimatedMinutes = {
  STORY: 5,
  CODING: 10,
  CHALLENGE: 15,
  PROJECT: 20,
} as const;

const lessons: LessonSeed[] = [
  {
    id: "lesson-1-2-1",
    moduleId: "module-1-2",
    order: 1,
    title: "Byte's Triangle",
    type: "CODING",
    xpReward: 100,
    gemReward: 5,
    content: {
      type: "coding",
      objective: "Draw a triangle using repeat, move, and turn blocks.",
      hint: "Repeat a move and a turn three times to close the triangle.",
      successCondition:
        "hasBlock:control_repeat|hasBlock:motion_movesteps|hasBlock:motion_turnright",
    },
  },
  {
    id: "lesson-1-2-2",
    moduleId: "module-1-2",
    order: 2,
    title: "The Rainbow Road",
    type: "CODING",
    xpReward: 150,
    gemReward: 10,
    content: {
      type: "coding",
      objective: "Create a rainbow path by changing pen colour in a loop.",
      hint: "Pick a pen colour, move forward, then repeat with new colours.",
      successCondition:
        "hasBlock:pen_setPenColorToColor|hasBlock:motion_movesteps|hasBlock:control_repeat",
    },
  },
  {
    id: "lesson-1-2-3",
    moduleId: "module-1-2",
    order: 3,
    title: "Zigzag Kingdom",
    type: "CODING",
    xpReward: 150,
    gemReward: 10,
    content: {
      type: "coding",
      objective: "Draw a zigzag trail using repeating moves and turns.",
      hint: "Alternate move and turn blocks inside a repeat loop.",
      successCondition:
        "hasBlock:motion_movesteps|hasBlock:motion_turnright|hasBlock:control_repeat",
    },
  },
  {
    id: "lesson-1-2-4",
    moduleId: "module-1-2",
    order: 4,
    title: "Spiral of Power",
    type: "CHALLENGE",
    xpReward: 200,
    gemReward: 15,
    content: {
      type: "challenge",
      objective: "Make a spiral using repeat loops with turns and moves.",
      hint: "Repeat move and turn many times to create a spiral.",
      successCondition:
        "hasBlock:control_repeat|hasBlock:motion_movesteps|hasBlock:motion_turnright",
    },
  },
  {
    id: "lesson-1-2-5",
    moduleId: "module-1-2",
    order: 5,
    title: "Pattern Machine",
    type: "CODING",
    xpReward: 150,
    gemReward: 10,
    content: {
      type: "coding",
      objective: "Build a repeating pattern with loops and colour changes.",
      hint: "Repeat a short pattern and switch colours inside the loop.",
      successCondition: "hasBlock:control_repeat|hasBlock:pen_setPenColorToColor",
    },
  },
  {
    id: "lesson-1-2-6",
    moduleId: "module-1-2",
    order: 6,
    title: "Byte's Hexagon",
    type: "CHALLENGE",
    xpReward: 200,
    gemReward: 15,
    content: {
      type: "challenge",
      objective: "Draw a hexagon using repeat and turn blocks.",
      hint: "A hexagon has six sides. Use repeat with a right turn.",
      successCondition: "hasBlock:control_repeat|hasBlock:motion_turnright",
    },
  },
  {
    id: "lesson-1-2-7",
    moduleId: "module-1-2",
    order: 7,
    title: "The Flower Garden",
    type: "CODING",
    xpReward: 200,
    gemReward: 15,
    content: {
      type: "coding",
      objective: "Create a flower pattern using repeat loops and colours.",
      hint: "Draw a petal, turn, then repeat with new colours.",
      successCondition:
        "hasBlock:control_repeat|hasBlock:motion_movesteps|hasBlock:pen_setPenColorToColor",
    },
  },
  {
    id: "lesson-1-2-8",
    moduleId: "module-1-2",
    order: 8,
    title: "Shape Shifter",
    type: "CHALLENGE",
    xpReward: 200,
    gemReward: 20,
    content: {
      type: "challenge",
      objective: "Use loops to build different shapes in one program.",
      hint: "Combine repeats and turns to change the shape.",
      successCondition:
        "hasBlock:control_repeat|hasBlock:motion_movesteps|hasBlock:motion_turnright",
    },
  },
  {
    id: "lesson-1-2-9",
    moduleId: "module-1-2",
    order: 9,
    title: "My Pattern World",
    type: "PROJECT",
    xpReward: 250,
    gemReward: 25,
    content: {
      type: "project",
      objective: "Create your own pattern world using loops and colours.",
      hint: "Mix repeating shapes with colour changes to build a world.",
      successCondition:
        "hasBlock:control_repeat|hasBlock:pen_setPenColorToColor|hasBlock:motion_movesteps",
    },
  },
  {
    id: "lesson-1-3-1",
    moduleId: "module-1-3",
    order: 1,
    title: "The Listening Program",
    type: "STORY",
    xpReward: 100,
    gemReward: 5,
    content: {
      type: "story",
      objective: "Learn how key press events make programs listen.",
      hint: "Look for yellow Events blocks that listen for keys.",
      successCondition: "hasBlock:event_whenkeypressed|hasBlock:motion_movesteps",
    },
  },
  {
    id: "lesson-1-3-2",
    moduleId: "module-1-3",
    order: 2,
    title: "Four Directions",
    type: "CODING",
    xpReward: 150,
    gemReward: 10,
    content: {
      type: "coding",
      objective: "Use key presses to move Byte in four directions.",
      hint: "Use multiple key press events with move and turn blocks.",
      successCondition:
        "hasBlock:event_whenkeypressed|hasBlock:motion_movesteps|hasBlock:motion_turnright",
    },
  },
  {
    id: "lesson-1-3-3",
    moduleId: "module-1-3",
    order: 3,
    title: "Byte's Dance Moves",
    type: "CODING",
    xpReward: 150,
    gemReward: 10,
    content: {
      type: "coding",
      objective: "Make Byte dance with key presses and speech.",
      hint: "Trigger a say block when a key is pressed.",
      successCondition: "hasBlock:event_whenkeypressed|hasBlock:looks_say",
    },
  },
  {
    id: "lesson-1-3-4",
    moduleId: "module-1-3",
    order: 4,
    title: "The Speed Challenge",
    type: "CHALLENGE",
    xpReward: 200,
    gemReward: 15,
    content: {
      type: "challenge",
      objective: "Create a fast move using loops and key presses.",
      hint: "Repeat moves inside a key press event.",
      successCondition:
        "hasBlock:event_whenkeypressed|hasBlock:motion_movesteps|hasBlock:control_repeat",
    },
  },
  {
    id: "lesson-1-3-5",
    moduleId: "module-1-3",
    order: 5,
    title: "Byte Answers Back",
    type: "CODING",
    xpReward: 150,
    gemReward: 10,
    content: {
      type: "coding",
      objective: "Ask a question and have Byte reply.",
      hint: "Use ask and say blocks together.",
      successCondition: "hasBlock:sensing_askandwait|hasBlock:looks_say",
    },
  },
  {
    id: "lesson-1-3-6",
    moduleId: "module-1-3",
    order: 6,
    title: "The Quiz Master",
    type: "CODING",
    xpReward: 200,
    gemReward: 15,
    content: {
      type: "coding",
      objective: "Build a quiz using ask, join, and say blocks.",
      hint: "Join text with the answer before saying it.",
      successCondition: "hasBlock:sensing_askandwait|hasBlock:operator_join|hasBlock:looks_say",
    },
  },
  {
    id: "lesson-1-3-7",
    moduleId: "module-1-3",
    order: 7,
    title: "Choose Your Colour",
    type: "CODING",
    xpReward: 150,
    gemReward: 10,
    content: {
      type: "coding",
      objective: "Let the player choose a pen colour.",
      hint: "Ask for a colour, then set the pen to it.",
      successCondition: "hasBlock:sensing_askandwait|hasBlock:pen_setPenColorToColor",
    },
  },
  {
    id: "lesson-1-3-8",
    moduleId: "module-1-3",
    order: 8,
    title: "The Reaction Game",
    type: "CHALLENGE",
    xpReward: 250,
    gemReward: 20,
    content: {
      type: "challenge",
      objective: "Make a reaction game using key presses and pen.",
      hint: "Use key events to trigger pen down and movement.",
      successCondition:
        "hasBlock:event_whenkeypressed|hasBlock:motion_movesteps|hasBlock:pen_penDown",
    },
  },
  {
    id: "lesson-1-3-9",
    moduleId: "module-1-3",
    order: 9,
    title: "My Interactive World",
    type: "PROJECT",
    xpReward: 300,
    gemReward: 25,
    content: {
      type: "project",
      objective: "Create an interactive world with keys and questions.",
      hint: "Combine key events with ask and say blocks.",
      successCondition:
        "hasBlock:event_whenkeypressed|hasBlock:sensing_askandwait|hasBlock:looks_say",
    },
  },
  {
    id: "lesson-1-4-1",
    moduleId: "module-1-4",
    order: 1,
    title: "Loops Inside Loops",
    type: "STORY",
    xpReward: 100,
    gemReward: 5,
    content: {
      type: "story",
      objective: "Discover how nested loops create bigger patterns.",
      hint: "A repeat block can sit inside another repeat block.",
      successCondition: "hasBlock:control_repeat|hasBlock:motion_movesteps",
    },
  },
  {
    id: "lesson-1-4-2",
    moduleId: "module-1-4",
    order: 2,
    title: "The Grid Painter",
    type: "CODING",
    xpReward: 200,
    gemReward: 15,
    content: {
      type: "coding",
      objective: "Draw a grid with nested loops and pen.",
      hint: "Repeat rows, and inside each row repeat columns.",
      successCondition: "hasBlock:control_repeat|hasBlock:pen_penDown|hasBlock:motion_movesteps",
    },
  },
  {
    id: "lesson-1-4-3",
    moduleId: "module-1-4",
    order: 3,
    title: "Count the Steps",
    type: "CODING",
    xpReward: 150,
    gemReward: 10,
    content: {
      type: "coding",
      objective: "Use repeat loops to count steps accurately.",
      hint: "Repeat move steps with a set number of repeats.",
      successCondition: "hasBlock:control_repeat|hasBlock:motion_movesteps",
    },
  },
  {
    id: "lesson-1-4-4",
    moduleId: "module-1-4",
    order: 4,
    title: "The Checker Board",
    type: "CHALLENGE",
    xpReward: 250,
    gemReward: 20,
    content: {
      type: "challenge",
      objective: "Create a checkerboard using pen colours and loops.",
      hint: "Repeat squares and switch colours each time.",
      successCondition:
        "hasBlock:control_repeat|hasBlock:pen_setPenColorToColor|hasBlock:motion_movesteps",
    },
  },
  {
    id: "lesson-1-4-5",
    moduleId: "module-1-4",
    order: 5,
    title: "Byte's Staircase",
    type: "CODING",
    xpReward: 200,
    gemReward: 15,
    content: {
      type: "coding",
      objective: "Draw a staircase using repeating moves and turns.",
      hint: "Move forward, turn, then repeat the pattern.",
      successCondition:
        "hasBlock:control_repeat|hasBlock:motion_movesteps|hasBlock:motion_turnright",
    },
  },
  {
    id: "lesson-1-4-6",
    moduleId: "module-1-4",
    order: 6,
    title: "The Spiral Galaxy",
    type: "CHALLENGE",
    xpReward: 300,
    gemReward: 25,
    content: {
      type: "challenge",
      objective: "Draw a galaxy spiral using repeat loops.",
      hint: "Repeat move and turn to swirl outward.",
      successCondition:
        "hasBlock:control_repeat|hasBlock:motion_movesteps|hasBlock:motion_turnright",
    },
  },
  {
    id: "lesson-1-4-7",
    moduleId: "module-1-4",
    order: 7,
    title: "Row of Houses",
    type: "CODING",
    xpReward: 200,
    gemReward: 15,
    content: {
      type: "coding",
      objective: "Repeat a house shape to build a row.",
      hint: "Create one house, then repeat it across the screen.",
      successCondition:
        "hasBlock:control_repeat|hasBlock:pen_penDown|hasBlock:pen_setPenColorToColor",
    },
  },
  {
    id: "lesson-1-4-8",
    moduleId: "module-1-4",
    order: 8,
    title: "The Master Pattern",
    type: "CHALLENGE",
    xpReward: 300,
    gemReward: 25,
    content: {
      type: "challenge",
      objective: "Combine loops and colours into a master pattern.",
      hint: "Use repeat blocks to build a big pattern from small ones.",
      successCondition:
        "hasBlock:control_repeat|hasBlock:pen_setPenColorToColor|hasBlock:motion_turnright",
    },
  },
  {
    id: "lesson-1-4-9",
    moduleId: "module-1-4",
    order: 9,
    title: "My Loop Masterpiece",
    type: "PROJECT",
    xpReward: 350,
    gemReward: 30,
    content: {
      type: "project",
      objective: "Create a masterpiece using loops and colours.",
      hint: "Layer repeats to build something big and bold.",
      successCondition:
        "hasBlock:control_repeat|hasBlock:pen_setPenColorToColor|hasBlock:motion_movesteps",
    },
  },
  {
    id: "lesson-1-5-1",
    moduleId: "module-1-5",
    order: 1,
    title: "Your Coding Journey",
    type: "STORY",
    xpReward: 100,
    gemReward: 5,
    content: {
      type: "story",
      objective: "Celebrate your journey with a flag and speech.",
      hint: "Start with when flag clicked, then say something proud.",
      successCondition: "hasBlock:event_whenflagclicked|hasBlock:looks_say",
    },
  },
  {
    id: "lesson-1-5-2",
    moduleId: "module-1-5",
    order: 2,
    title: "Design Your World",
    type: "CODING",
    xpReward: 200,
    gemReward: 15,
    content: {
      type: "coding",
      objective: "Draw your world using pen, colour, and movement.",
      hint: "Use pen down, move steps, and change colours.",
      successCondition:
        "hasBlock:pen_penDown|hasBlock:pen_setPenColorToColor|hasBlock:motion_movesteps",
    },
  },
  {
    id: "lesson-1-5-3",
    moduleId: "module-1-5",
    order: 3,
    title: "Add Interactivity",
    type: "CODING",
    xpReward: 200,
    gemReward: 15,
    content: {
      type: "coding",
      objective: "Add key press controls to your project.",
      hint: "Use when key pressed blocks to move Byte.",
      successCondition: "hasBlock:event_whenkeypressed|hasBlock:motion_movesteps",
    },
  },
  {
    id: "lesson-1-5-4",
    moduleId: "module-1-5",
    order: 4,
    title: "Add Patterns",
    type: "CODING",
    xpReward: 200,
    gemReward: 15,
    content: {
      type: "coding",
      objective: "Use loops and colours to add patterns.",
      hint: "Repeat your pattern and change colours each time.",
      successCondition: "hasBlock:control_repeat|hasBlock:pen_setPenColorToColor",
    },
  },
  {
    id: "lesson-1-5-5",
    moduleId: "module-1-5",
    order: 5,
    title: "Make it Talk",
    type: "CODING",
    xpReward: 200,
    gemReward: 15,
    content: {
      type: "coding",
      objective: "Make your world talk using ask and say.",
      hint: "Ask a question, then say the answer.",
      successCondition: "hasBlock:sensing_askandwait|hasBlock:looks_say",
    },
  },
  {
    id: "lesson-1-5-6",
    moduleId: "module-1-5",
    order: 6,
    title: "Byte's Final Challenge",
    type: "CHALLENGE",
    xpReward: 400,
    gemReward: 30,
    content: {
      type: "challenge",
      objective: "Combine loops, keys, pen colours, and speech.",
      hint: "Use repeat, key press, pen colour, and say blocks together.",
      successCondition:
        "hasBlock:control_repeat|hasBlock:event_whenkeypressed|hasBlock:pen_setPenColorToColor|hasBlock:looks_say",
    },
  },
  {
    id: "lesson-1-5-7",
    moduleId: "module-1-5",
    order: 7,
    title: "Test and Polish",
    type: "PROJECT",
    xpReward: 250,
    gemReward: 20,
    content: {
      type: "project",
      objective: "Test your project and polish it with loops.",
      hint: "Use when flag clicked and repeat to refine your work.",
      successCondition: "hasBlock:event_whenflagclicked|hasBlock:control_repeat",
    },
  },
  {
    id: "lesson-1-5-8",
    moduleId: "module-1-5",
    order: 8,
    title: "Share Your Story",
    type: "PROJECT",
    xpReward: 300,
    gemReward: 25,
    content: {
      type: "project",
      objective: "Build a story that moves and speaks.",
      hint: "Use when flag clicked, say, and move blocks.",
      successCondition:
        "hasBlock:event_whenflagclicked|hasBlock:looks_say|hasBlock:motion_movesteps",
    },
  },
  {
    id: "lesson-1-5-9",
    moduleId: "module-1-5",
    order: 9,
    title: "The Spark Masterwork",
    type: "PROJECT",
    xpReward: 500,
    gemReward: 50,
    content: {
      type: "project",
      objective: "Combine everything to craft your Spark masterwork.",
      hint: "Mix repeats, keys, colours, and questions.",
      successCondition:
        "hasBlock:control_repeat|hasBlock:event_whenkeypressed|hasBlock:pen_setPenColorToColor|hasBlock:sensing_askandwait",
    },
  },
];

async function main() {
  await prisma.phase.upsert({
    where: { number: 1 },
    update: {},
    create: {
      id: "phase-1",
      number: 1,
      title: "Spark Zone",
      kingdom: "Pixel Pioneers",
      mentor: "Byte",
      ageMin: 6,
      ageMax: 9,
      colorHex: "#00D4FF",
    },
  });

  await prisma.module.upsert({
    where: { id: "module-1-2" },
    update: {},
    create: {
      id: "module-1-2",
      phaseId: "phase-1",
      order: 2,
      title: "Lines, Shapes and Patterns",
      description: "Byte teaches Pixel Pioneers how to draw anything with mathematical precision.",
      weeks: 2,
      skills: ["Loops", "Geometry", "Patterns", "Pen control", "Nested repetition"],
    },
  });

  await prisma.module.upsert({
    where: { id: "module-1-3" },
    update: {},
    create: {
      id: "module-1-3",
      phaseId: "phase-1",
      order: 3,
      title: "Events and Interaction",
      description: "Byte shows Pioneers how to make programs that listen and respond.",
      weeks: 2,
      skills: [
        "Event handling",
        "Keyboard input",
        "Conditions",
        "User interaction",
        "Real-time response",
      ],
    },
  });

  await prisma.module.upsert({
    where: { id: "module-1-4" },
    update: {},
    create: {
      id: "module-1-4",
      phaseId: "phase-1",
      order: 4,
      title: "Loops and Repetition Mastery",
      description:
        "The deepest secrets of Byte's power — how to make computers do enormous things with tiny code.",
      weeks: 2,
      skills: [
        "Nested loops",
        "Counting patterns",
        "Efficiency thinking",
        "Complex repetition",
        "Problem decomposition",
      ],
    },
  });

  await prisma.module.upsert({
    where: { id: "module-1-5" },
    update: {},
    create: {
      id: "module-1-5",
      phaseId: "phase-1",
      order: 5,
      title: "The Spark Zone Capstone",
      description:
        "The final adventure of the Spark Zone. Pioneers combine everything they know to build their masterwork and earn the Spark Badge.",
      weeks: 2,
      skills: [
        "Project design",
        "Creative synthesis",
        "All Phase 1 concepts",
        "Gallery publishing",
        "Presentation",
      ],
    },
  });

  for (const lesson of lessons) {
    const estimatedMin = estimatedMinutes[lesson.type];
    await prisma.lesson.upsert({
      where: { id: lesson.id },
      update: {
        moduleId: lesson.moduleId,
        order: lesson.order,
        title: lesson.title,
        type: lesson.type as never,
        content: lesson.content,
        xpReward: lesson.xpReward,
        gemReward: lesson.gemReward,
        estimatedMin,
        starterCode: Prisma.DbNull,
        solutionCode: Prisma.DbNull,
      },
      create: {
        id: lesson.id,
        moduleId: lesson.moduleId,
        order: lesson.order,
        title: lesson.title,
        type: lesson.type as never,
        content: lesson.content,
        xpReward: lesson.xpReward,
        gemReward: lesson.gemReward,
        estimatedMin,
        starterCode: Prisma.DbNull,
        solutionCode: Prisma.DbNull,
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
