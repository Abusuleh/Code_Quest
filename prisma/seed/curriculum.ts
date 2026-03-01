import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const lessons = [
  {
    id: "lesson-1-1-1",
    order: 1,
    title: "Wake Up, Byte!",
    type: "STORY",
    xpReward: 100,
    gemReward: 5,
    estimatedMin: 10,
    content: {
      type: "story",
      objective: "Drag when_flag_clicked and say block to make Byte say Hello World",
      hint: "Start with the yellow Events block — it is the power switch for your program!",
      successCondition: "hasBlock:event_whenflagclicked|hasBlock:looks_say",
      starterXml: "<xml><block type='event_whenflagclicked'></block></xml>",
    },
  },
  {
    id: "lesson-1-1-2",
    order: 2,
    title: "Make Byte Move!",
    type: "CODING",
    xpReward: 100,
    gemReward: 5,
    estimatedMin: 15,
    content: {
      type: "coding",
      objective: "Use move steps block inside a repeat loop to animate Byte",
      hint: "The Motion blocks are the blue ones. Loops live in the orange Control section!",
      successCondition: "hasBlock:motion_movesteps|hasBlock:control_repeat",
      starterXml: "<xml><block type='event_whenflagclicked'></block></xml>",
    },
  },
  {
    id: "lesson-1-1-3",
    order: 3,
    title: "Byte Draws a Line",
    type: "CODING",
    xpReward: 100,
    gemReward: 5,
    estimatedMin: 15,
    content: {
      type: "coding",
      objective: "Use pen down and move steps to draw a line",
      hint: "First find Pen blocks in the Extensions section — look for the + button at the bottom!",
      successCondition: "hasBlock:pen_penDown|hasBlock:motion_movesteps",
      starterXml: "<xml><block type='event_whenflagclicked'></block></xml>",
    },
  },
  {
    id: "lesson-1-1-4",
    order: 4,
    title: "Colours of the Kingdom",
    type: "CODING",
    xpReward: 150,
    gemReward: 10,
    estimatedMin: 15,
    content: {
      type: "coding",
      objective: "Change pen colour and draw multiple coloured lines using loops",
      hint: "The set pen color to block lets you pick any colour! Try the colour picker.",
      successCondition: "hasBlock:pen_setPenColorToColor|hasBlock:control_repeat",
      starterXml: "<xml><block type='event_whenflagclicked'></block></xml>",
    },
  },
  {
    id: "lesson-1-1-5",
    order: 5,
    title: "Byte Draws a Square",
    type: "CODING",
    xpReward: 150,
    gemReward: 10,
    estimatedMin: 20,
    content: {
      type: "coding",
      objective: "Draw a square using a repeat 4 loop with move and turn blocks",
      hint: "A square has 4 equal sides and 4 right angle turns. How many degrees is a right angle?",
      successCondition: "hasBlock:control_repeat|hasBlock:motion_turnright",
      starterXml: "<xml><block type='event_whenflagclicked'></block></xml>",
    },
  },
  {
    id: "lesson-1-1-6",
    order: 6,
    title: "The Spinning Star",
    type: "CHALLENGE",
    xpReward: 200,
    gemReward: 15,
    estimatedMin: 20,
    content: {
      type: "challenge",
      objective: "Draw a 5-pointed star using repeat 5 with move and turn 144 degrees",
      hint: "A star is a pentagon made of triangles. Repeat 5 times, move forward, turn 144 degrees. Try it!",
      successCondition:
        "hasBlock:control_repeat|hasBlock:motion_movesteps|hasBlock:motion_turnright",
      starterXml: "<xml><block type='event_whenflagclicked'></block></xml>",
    },
  },
  {
    id: "lesson-1-1-7",
    order: 7,
    title: "Byte Hears You!",
    type: "CODING",
    xpReward: 100,
    gemReward: 5,
    estimatedMin: 15,
    content: {
      type: "coding",
      objective: "Use when key pressed events to control Byte movement",
      hint: "Look in the Events section — there is a yellow block that says 'when [space] key pressed'. Click the dropdown to change which key!",
      successCondition: "hasBlock:event_whenkeypressed|hasBlock:motion_movesteps",
      starterXml: "<xml></xml>",
    },
  },
  {
    id: "lesson-1-1-8",
    order: 8,
    title: "Make Byte Talk!",
    type: "CODING",
    xpReward: 100,
    gemReward: 5,
    estimatedMin: 15,
    content: {
      type: "coding",
      objective: "Use ask block and join to make Byte greet the user by name",
      hint: "After the 'ask' block runs, the answer is stored automatically. Use the 'join' block from Operators to combine 'Hello, ' with the answer!",
      successCondition: "hasBlock:sensing_askandwait|hasBlock:operator_join|hasBlock:looks_say",
      starterXml: "<xml><block type='event_whenflagclicked'></block></xml>",
    },
  },
  {
    id: "lesson-1-1-9",
    order: 9,
    title: "Byte's Pixel Garden",
    type: "PROJECT",
    xpReward: 200,
    gemReward: 20,
    estimatedMin: 25,
    content: {
      type: "project",
      objective: "Create a free-form drawing program using sequences, loops, events, and at least 3 colours",
      hint: "There is no wrong answer here! Start by drawing your favourite shape, then add colours, then add keyboard control. Make Byte proud!",
      successCondition:
        "hasBlock:control_repeat|hasBlock:pen_setPenColorToColor|hasBlock:event_whenkeypressed",
      starterXml: "<xml><block type='event_whenflagclicked'></block></xml>",
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
    where: { id: "module-1-1" },
    update: {},
    create: {
      id: "module-1-1",
      phaseId: "phase-1",
      order: 1,
      title: "Hello, Pixel World!",
      description: "Meet Byte and make your first program move and glow.",
      weeks: 2,
      skills: ["Sequences", "Events", "Loops", "Motion blocks", "Looks blocks"],
    },
  });

  for (const lesson of lessons) {
    await prisma.lesson.upsert({
      where: { id: lesson.id },
      update: {
        moduleId: "module-1-1",
        order: lesson.order,
        title: lesson.title,
        type: lesson.type as never,
        content: lesson.content,
        xpReward: lesson.xpReward,
        gemReward: lesson.gemReward,
        estimatedMin: lesson.estimatedMin,
        starterCode: { xml: lesson.content.starterXml },
        solutionCode: Prisma.DbNull,
      },
      create: {
        id: lesson.id,
        moduleId: "module-1-1",
        order: lesson.order,
        title: lesson.title,
        type: lesson.type as never,
        content: lesson.content,
        xpReward: lesson.xpReward,
        gemReward: lesson.gemReward,
        estimatedMin: lesson.estimatedMin,
        starterCode: { xml: lesson.content.starterXml },
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
