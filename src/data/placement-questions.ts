// src/data/placement-questions.ts
// REPLACE ALL PLACEHOLDER CONTENT WITH THIS EXACTLY

export type PlacementQuestion = {
  id: number;
  byteComment: string; // Byte's narration above the question
  question: string;
  answers: {
    text: string;
    emoji: string;
    phase: 1 | 2 | 3 | 4; // which phase this answer leans toward
  }[];
};

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  {
    id: 1,
    byteComment: "Let's start easy! I want to get to know you.",
    question: "How old are you?",
    answers: [
      { text: "6 or 7", emoji: "🌱", phase: 1 },
      { text: "8 or 9", emoji: "🌿", phase: 1 },
      { text: "10 or 11", emoji: "🌳", phase: 2 },
      { text: "12, 13, or 14", emoji: "🚀", phase: 3 },
    ],
  },
  {
    id: 2,
    byteComment: "Interesting! Now let's see what you already know.",
    question: "Have you ever coded anything before?",
    answers: [
      { text: "Never — this is brand new to me!", emoji: "✨", phase: 1 },
      { text: "I've tried Scratch or block coding", emoji: "🧩", phase: 2 },
      { text: "I've written some Python or JavaScript", emoji: "🐍", phase: 3 },
      { text: "I build real projects and apps", emoji: "🏗️", phase: 4 },
    ],
  },
  {
    id: 3,
    byteComment: "Ooh, good to know! Here's a fun one...",
    question: "If you could build ANYTHING with code, what would it be?",
    answers: [
      { text: "A silly game with animals and colours", emoji: "🐱", phase: 1 },
      { text: "A quiz about my favourite TV show", emoji: "🎮", phase: 2 },
      { text: "A website for my hobby or business idea", emoji: "🌐", phase: 3 },
      { text: "An AI that can answer questions", emoji: "🤖", phase: 4 },
    ],
  },
  {
    id: 4,
    byteComment: "Love it. Let's try something a bit more technical!",
    question: "What is a 'variable' in coding?",
    answers: [
      { text: "No idea — I've never heard that word", emoji: "🤷", phase: 1 },
      { text: "A box that stores information", emoji: "📦", phase: 2 },
      { text: "A name that holds a value you can change", emoji: "🏷️", phase: 3 },
      { text: "A named memory location with a data type", emoji: "💾", phase: 4 },
    ],
  },
  {
    id: 5,
    byteComment: "You're doing great! Keep going, adventurer.",
    question: "If you see this code: 5 + 3 * 2 — what's the answer?",
    answers: [
      { text: "16 (I added first, then multiplied)", emoji: "➕", phase: 1 },
      { text: "11 (multiplication happens first!)", emoji: "✖️", phase: 3 },
      { text: "I'm not sure", emoji: "🤔", phase: 2 },
      { text: "It depends on the language", emoji: "🧠", phase: 4 },
    ],
  },
  {
    id: 6,
    byteComment: "Nice! Let me ask about how you like to learn.",
    question: "When something goes wrong with your work, what do you do?",
    answers: [
      { text: "Ask a grown-up straight away", emoji: "🙋", phase: 1 },
      { text: "Try a few things and then ask for help", emoji: "🔍", phase: 2 },
      { text: "Google it and try to fix it myself", emoji: "🔎", phase: 3 },
      { text: "Read the error message and debug it", emoji: "🐛", phase: 4 },
    ],
  },
  {
    id: 7,
    byteComment: "Brilliant debugging instincts! What about this...",
    question: "What does HTML stand for?",
    answers: [
      { text: "I don't know", emoji: "❓", phase: 1 },
      { text: "HyperText Markup Language — it builds web pages", emoji: "🌐", phase: 3 },
      { text: "I've heard of it but I'm not sure", emoji: "🤏", phase: 2 },
      { text: "The structure layer of the web (vs CSS and JS)", emoji: "🏛️", phase: 4 },
    ],
  },
  {
    id: 8,
    byteComment: "Web knowledge! Let's switch to problem solving.",
    question:
      "A robot has to walk through a maze. It can only go forward, turn left, or turn right. Which order of instructions gets it to the exit?",
    answers: [
      { text: "Forward, forward, turn right, forward — sounds right!", emoji: "🤖", phase: 2 },
      { text: "I'd need to see the maze first", emoji: "🗺️", phase: 3 },
      { text: "I'd write a loop to check each path", emoji: "🔄", phase: 4 },
      { text: "I'm not sure — mazes confuse me", emoji: "😅", phase: 1 },
    ],
  },
  {
    id: 9,
    byteComment: "Logical! You're thinking like a coder already.",
    question: "What is a 'loop' in coding?",
    answers: [
      { text: "Something that goes round and round — not sure exactly", emoji: "🌀", phase: 1 },
      { text: "A way to repeat an action multiple times", emoji: "🔁", phase: 2 },
      { text: "for, while, and forEach — they each work differently", emoji: "⚙️", phase: 3 },
      {
        text: "A control flow structure with iteration, condition, and state change",
        emoji: "🧮",
        phase: 4,
      },
    ],
  },
  {
    id: 10,
    byteComment: "You're flying through this! Nearly there.",
    question: "Which of these does NOT belong with the others?",
    answers: [
      { text: "Python", emoji: "🐍", phase: 3 },
      { text: "Google", emoji: "🔍", phase: 1 },
      { text: "JavaScript", emoji: "⚡", phase: 3 },
      { text: "Scratch", emoji: "🧩", phase: 2 },
    ],
  },
  {
    id: 11,
    byteComment: "Good eye! What's your favourite subject at school?",
    question: "Which subject do you enjoy most?",
    answers: [
      { text: "Art and Design — I love making things look great", emoji: "🎨", phase: 2 },
      { text: "Maths — patterns and logic are satisfying", emoji: "📐", phase: 3 },
      { text: "Science — I want to understand how things work", emoji: "🔬", phase: 3 },
      { text: "English or Drama — I love stories and creativity", emoji: "📖", phase: 1 },
    ],
  },
  {
    id: 12,
    byteComment: "Wonderful! You're almost at the Kingdom gates.",
    question: "If you had to explain coding to a younger child, what would you say?",
    answers: [
      { text: "It's like giving instructions to a very obedient robot", emoji: "🤖", phase: 2 },
      { text: "It's writing in a special language computers understand", emoji: "💬", phase: 3 },
      { text: "It's like magic — you type words and things happen!", emoji: "✨", phase: 1 },
      { text: "It's solving problems by breaking them into small steps", emoji: "🧩", phase: 4 },
    ],
  },
  {
    id: 13,
    byteComment: "That's a great definition! Two more to go.",
    question: "What is a 'function' in coding?",
    answers: [
      { text: "I don't know that word", emoji: "❓", phase: 1 },
      { text: "A reusable block of code that does one job", emoji: "🔧", phase: 2 },
      { text: "A named block with inputs (parameters) and outputs", emoji: "⚙️", phase: 3 },
      { text: "A first-class value that can be passed and returned", emoji: "🧠", phase: 4 },
    ],
  },
  {
    id: 14,
    byteComment: "Almost there! You're doing amazingly.",
    question: "How much time would you like to spend learning to code each week?",
    answers: [
      { text: "Just 15–20 minutes — little and often", emoji: "⏱️", phase: 1 },
      { text: "About 30–45 minutes a few times a week", emoji: "📅", phase: 2 },
      { text: "An hour or more — I want to go fast", emoji: "🚀", phase: 3 },
      { text: "As much as possible — I'm fully committed", emoji: "🔥", phase: 4 },
    ],
  },
  {
    id: 15,
    byteComment: "Last one! Choose the one that feels most like you.",
    question: "Which adventurer are YOU?",
    answers: [
      { text: "The Curious Explorer — everything is new and exciting!", emoji: "🌟", phase: 1 },
      { text: "The Creative Builder — I love making things from scratch", emoji: "🏗️", phase: 2 },
      { text: "The Problem Solver — give me a challenge to crack", emoji: "🔍", phase: 3 },
      {
        text: "The Code Architect — I think about systems and how they scale",
        emoji: "🏛️",
        phase: 4,
      },
    ],
  },
];

// PHASE ASSIGNMENT ALGORITHM
// Score = average of all 15 answer phase values
// Phase 1 (Pixel Pioneers):   score < 1.75
// Phase 2 (Logic Labyrinth):  score >= 1.75 && < 2.5
// Phase 3 (Web Wilderness):   score >= 2.5  && < 3.25
// Phase 4 (Code Citadel):     score >= 3.25
//
// AGE OVERRIDE (always apply after scoring):
// If age answer = "6 or 7" → cap at Phase 1 regardless of score
// If age answer = "8 or 9" → cap at Phase 2 regardless of score
// If age answer = "12, 13, or 14" → floor at Phase 2 if score would give Phase 1
