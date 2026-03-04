import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const baseHtml = (title: string) => `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
  </head>
  <body>
  </body>
</html>`;

const lessons = [
  {
    id: "lesson-3-1-1",
    moduleId: "module-3-1",
    order: 1,
    title: "Meet Forge",
    type: "STORY",
    xpReward: 100,
    gemReward: 5,
    estimatedMin: 10,
    content: {
      type: "story",
      objective: "Meet Forge and see what a real web page is made of.",
      hint: "Every page starts with a structure of HTML tags.",
      successCondition: "hasHTML:<h1",
    },
    starterCode: { html: baseHtml("Meet Forge"), css: "", js: "" },
  },
  {
    id: "lesson-3-1-2",
    moduleId: "module-3-1",
    order: 2,
    title: "Your First Page",
    type: "CODING",
    xpReward: 150,
    gemReward: 10,
    estimatedMin: 12,
    content: {
      type: "coding",
      objective: "Build a basic HTML page structure.",
      hint: "Use <html>, <head>, and <body>.",
      successCondition: "hasHTML:<html",
    },
    starterCode: { html: baseHtml("My First Page"), css: "", js: "" },
  },
  {
    id: "lesson-3-1-3",
    moduleId: "module-3-1",
    order: 3,
    title: "Headings and Paragraphs",
    type: "CODING",
    xpReward: 150,
    gemReward: 10,
    estimatedMin: 12,
    content: {
      type: "coding",
      objective: "Add a heading and a paragraph to the page.",
      hint: "Try <h1> and <p>.",
      successCondition: "hasHTML:<h1|hasHTML:<p",
    },
    starterCode: {
      html: `${baseHtml("Headings")}
  <h1>Forge</h1>
  <p>My first web page.</p>`,
      css: "",
      js: "",
    },
  },
  {
    id: "lesson-3-1-4",
    moduleId: "module-3-1",
    order: 4,
    title: "Lists and Links",
    type: "CODING",
    xpReward: 150,
    gemReward: 10,
    estimatedMin: 12,
    content: {
      type: "coding",
      objective: "Create a list and add a link.",
      hint: 'Use <ul> with <li>, and <a href="...">.',
      successCondition: "hasHTML:<ul|hasHTML:<a",
    },
    starterCode: {
      html: `${baseHtml("Lists")}
  <h1>My Tools</h1>
  <ul>
    <li>Hammer</li>
  </ul>
  <a href=\"https://codequest.world\">Visit CodeQuest</a>`,
      css: "",
      js: "",
    },
  },
  {
    id: "lesson-3-1-5",
    moduleId: "module-3-1",
    order: 5,
    title: "Images and Alt Text",
    type: "CODING",
    xpReward: 150,
    gemReward: 10,
    estimatedMin: 12,
    content: {
      type: "coding",
      objective: "Add an image with alt text.",
      hint: 'Use <img src="..." alt="...">.',
      successCondition: "hasHTML:<img",
    },
    starterCode: {
      html: `${baseHtml("Images")}
  <h1>Forge Badge</h1>
  <img src=\"https://placehold.co/300x200\" alt=\"Forge badge\" />`,
      css: "",
      js: "",
    },
  },
  {
    id: "lesson-3-1-6",
    moduleId: "module-3-1",
    order: 6,
    title: "Sections and Layout Blocks",
    type: "CODING",
    xpReward: 150,
    gemReward: 10,
    estimatedMin: 14,
    content: {
      type: "coding",
      objective: "Group content using sections.",
      hint: "Wrap related content in <section>.",
      successCondition: "hasHTML:<section",
    },
    starterCode: {
      html: `${baseHtml("Sections")}
  <section>
    <h2>Profile</h2>
    <p>Forge builder.</p>
  </section>`,
      css: "",
      js: "",
    },
  },
  {
    id: "lesson-3-1-7",
    moduleId: "module-3-1",
    order: 7,
    title: "Buttons and Inputs",
    type: "CODING",
    xpReward: 150,
    gemReward: 10,
    estimatedMin: 14,
    content: {
      type: "coding",
      objective: "Add a button and an input field.",
      hint: "Use <button> and <input>.",
      successCondition: "hasHTML:<button|hasHTML:<input",
    },
    starterCode: {
      html: `${baseHtml("Buttons")}
  <input placeholder=\"Your name\" />
  <button>Submit</button>`,
      css: "",
      js: "",
    },
  },
  {
    id: "lesson-3-1-8",
    moduleId: "module-3-1",
    order: 8,
    title: "Mini Bio Page",
    type: "CHALLENGE",
    xpReward: 250,
    gemReward: 20,
    estimatedMin: 16,
    content: {
      type: "challenge",
      objective: "Build a short bio page with a heading and list.",
      hint: "Use <h2> and <ul>.",
      successCondition: "hasHTML:<h2|hasHTML:<ul",
    },
    starterCode: {
      html: `${baseHtml("Bio")}
  <h2>About Me</h2>
  <ul>
    <li>Builder</li>
  </ul>`,
      css: "",
      js: "",
    },
  },
  {
    id: "lesson-3-1-9",
    moduleId: "module-3-1",
    order: 9,
    title: "The About Card",
    type: "CHALLENGE",
    xpReward: 250,
    gemReward: 20,
    estimatedMin: 16,
    content: {
      type: "challenge",
      objective: "Create a card layout using a div and class.",
      hint: 'Add class="card" and style later.',
      successCondition: "hasHTML:<div|hasHTML:class=",
    },
    starterCode: {
      html: `${baseHtml("Card")}
  <div class=\"card\">
    <h3>Forge Builder</h3>
    <p>Learning to build on the web.</p>
  </div>`,
      css: "",
      js: "",
    },
  },
  {
    id: "lesson-3-1-10",
    moduleId: "module-3-1",
    order: 10,
    title: "My First HTML Page",
    type: "PROJECT",
    xpReward: 350,
    gemReward: 30,
    estimatedMin: 20,
    content: {
      type: "project",
      objective: "Build a complete HTML page with header and footer.",
      hint: "Use <header> and <footer> to frame your page.",
      successCondition: "hasHTML:<header|hasHTML:<footer",
    },
    starterCode: {
      html: `${baseHtml("My Page")}
  <header><h1>Forge</h1></header>
  <main><p>My first web page.</p></main>
  <footer>Built with CodeQuest</footer>`,
      css: "",
      js: "",
    },
  },
  {
    id: "lesson-3-2-1",
    moduleId: "module-3-2",
    order: 1,
    title: "Paint the Page",
    type: "STORY",
    xpReward: 100,
    gemReward: 5,
    estimatedMin: 10,
    content: {
      type: "story",
      objective: "See how CSS paints your HTML.",
      hint: "CSS controls color, size, and layout.",
      successCondition: "hasCSS:color",
    },
    starterCode: { html: baseHtml("CSS"), css: "body { color: #222; }", js: "" },
  },
  {
    id: "lesson-3-2-2",
    moduleId: "module-3-2",
    order: 2,
    title: "Color and Background",
    type: "CODING",
    xpReward: 150,
    gemReward: 10,
    estimatedMin: 12,
    content: {
      type: "coding",
      objective: "Set a background color and text color.",
      hint: "Try background and color.",
      successCondition: "hasCSS:background",
    },
    starterCode: {
      html: `${baseHtml("Colors")}
  <h1>Forge Colors</h1>`,
      css: "body { background: #111018; color: #ffffff; }",
      js: "",
    },
  },
  {
    id: "lesson-3-2-3",
    moduleId: "module-3-2",
    order: 3,
    title: "Fonts and Text",
    type: "CODING",
    xpReward: 150,
    gemReward: 10,
    estimatedMin: 12,
    content: {
      type: "coding",
      objective: "Style text with font settings.",
      hint: "Use font-family and font-size.",
      successCondition: "hasCSS:font",
    },
    starterCode: {
      html: `${baseHtml("Fonts")}
  <h1>Forge Text</h1>`,
      css: "body { font-family: Arial, sans-serif; font-size: 18px; }",
      js: "",
    },
  },
  {
    id: "lesson-3-2-4",
    moduleId: "module-3-2",
    order: 4,
    title: "Spacing with Margin",
    type: "CODING",
    xpReward: 150,
    gemReward: 10,
    estimatedMin: 12,
    content: {
      type: "coding",
      objective: "Add space with margin.",
      hint: "Use margin on headings or cards.",
      successCondition: "hasCSS:margin",
    },
    starterCode: {
      html: `${baseHtml("Margin")}
  <h1>Forge Space</h1>`,
      css: "h1 { margin: 24px 0; }",
      js: "",
    },
  },
  {
    id: "lesson-3-2-5",
    moduleId: "module-3-2",
    order: 5,
    title: "Padding and Borders",
    type: "CODING",
    xpReward: 150,
    gemReward: 10,
    estimatedMin: 12,
    content: {
      type: "coding",
      objective: "Add padding and borders to a card.",
      hint: "Use padding and border.",
      successCondition: "hasCSS:padding|hasCSS:border",
    },
    starterCode: {
      html: `${baseHtml("Padding")}
  <div class=\"card\">Forge Card</div>`,
      css: ".card { padding: 16px; border: 2px solid #ff994a; }",
      js: "",
    },
  },
  {
    id: "lesson-3-2-6",
    moduleId: "module-3-2",
    order: 6,
    title: "Flexbox Basics",
    type: "CODING",
    xpReward: 150,
    gemReward: 10,
    estimatedMin: 14,
    content: {
      type: "coding",
      objective: "Line up items using flexbox.",
      hint: "Try display: flex.",
      successCondition: "hasCSS:flex",
    },
    starterCode: {
      html: `${baseHtml("Flex")}
  <div class=\"row\">
    <div>One</div>
    <div>Two</div>
  </div>`,
      css: ".row { display: flex; gap: 12px; }",
      js: "",
    },
  },
  {
    id: "lesson-3-2-7",
    moduleId: "module-3-2",
    order: 7,
    title: "Cards and Shadows",
    type: "CODING",
    xpReward: 150,
    gemReward: 10,
    estimatedMin: 14,
    content: {
      type: "coding",
      objective: "Add depth with box-shadow.",
      hint: "Use box-shadow on a card.",
      successCondition: "hasCSS:box-shadow",
    },
    starterCode: {
      html: `${baseHtml("Shadow")}
  <div class=\"card\">Forge Shadow</div>`,
      css: ".card { box-shadow: 0 10px 30px rgba(0,0,0,0.2); padding: 16px; }",
      js: "",
    },
  },
  {
    id: "lesson-3-2-8",
    moduleId: "module-3-2",
    order: 8,
    title: "Style a Profile",
    type: "CHALLENGE",
    xpReward: 250,
    gemReward: 20,
    estimatedMin: 16,
    content: {
      type: "challenge",
      objective: "Round your profile card with border radius.",
      hint: "Try border-radius: 16px.",
      successCondition: "hasCSS:border-radius",
    },
    starterCode: {
      html: `${baseHtml("Profile")}
  <div class=\"profile\">Forge Builder</div>`,
      css: ".profile { border-radius: 16px; padding: 20px; border: 2px solid #ff994a; }",
      js: "",
    },
  },
  {
    id: "lesson-3-2-9",
    moduleId: "module-3-2",
    order: 9,
    title: "Layout a Hero",
    type: "CHALLENGE",
    xpReward: 250,
    gemReward: 20,
    estimatedMin: 16,
    content: {
      type: "challenge",
      objective: "Create a hero section layout.",
      hint: "Use display and align items.",
      successCondition: "hasCSS:display",
    },
    starterCode: {
      html: `${baseHtml("Hero")}
  <section class=\"hero\"><h1>Forge</h1></section>`,
      css: ".hero { display: flex; align-items: center; height: 200px; }",
      js: "",
    },
  },
  {
    id: "lesson-3-2-10",
    moduleId: "module-3-2",
    order: 10,
    title: "Styled Homepage",
    type: "PROJECT",
    xpReward: 350,
    gemReward: 30,
    estimatedMin: 20,
    content: {
      type: "project",
      objective: "Build a styled homepage using color and fonts.",
      hint: "Mix background, font, and spacing.",
      successCondition: "hasCSS:background|hasCSS:font",
    },
    starterCode: {
      html: `${baseHtml("Homepage")}
  <h1>Forge Home</h1>
  <p>Welcome to my website.</p>`,
      css: "body { background: #111018; color: #fff; font-family: Arial, sans-serif; }",
      js: "",
    },
  },
  {
    id: "lesson-3-3-1",
    moduleId: "module-3-3",
    order: 1,
    title: "JavaScript Power",
    type: "STORY",
    xpReward: 100,
    gemReward: 5,
    estimatedMin: 10,
    content: {
      type: "story",
      objective: "See how JavaScript makes pages react.",
      hint: "Use console.log to test JavaScript.",
      successCondition: "hasJS:console.log",
    },
    starterCode: { html: baseHtml("JS"), css: "", js: "console.log('Forge');" },
  },
  {
    id: "lesson-3-3-2",
    moduleId: "module-3-3",
    order: 2,
    title: "Variables and Text",
    type: "CODING",
    xpReward: 150,
    gemReward: 10,
    estimatedMin: 12,
    content: {
      type: "coding",
      objective: "Store a value in a const and print it.",
      hint: "Try const name = 'Forge'.",
      successCondition: "hasJS:const",
    },
    starterCode: {
      html: `${baseHtml("Variables")}
  <h1 id=\"title\">Forge</h1>`,
      css: "",
      js: "const name = 'Forge';\nconsole.log(name);",
    },
  },
  {
    id: "lesson-3-3-3",
    moduleId: "module-3-3",
    order: 3,
    title: "Change the Page",
    type: "CODING",
    xpReward: 150,
    gemReward: 10,
    estimatedMin: 12,
    content: {
      type: "coding",
      objective: "Select an element and change its text.",
      hint: "Use document.querySelector.",
      successCondition: "hasJS:querySelector",
    },
    starterCode: {
      html: `${baseHtml("Select")}
  <h1 id=\"title\">Forge</h1>`,
      css: "",
      js: "const title = document.querySelector('#title');\nif (title) title.textContent = 'Forge Ready';",
    },
  },
  {
    id: "lesson-3-3-4",
    moduleId: "module-3-3",
    order: 4,
    title: "Button Clicks",
    type: "CODING",
    xpReward: 150,
    gemReward: 10,
    estimatedMin: 12,
    content: {
      type: "coding",
      objective: "Add a click listener to a button.",
      hint: "Use addEventListener.",
      successCondition: "hasJS:addEventListener",
    },
    starterCode: {
      html: `${baseHtml("Click")}
  <button id=\"fire\">Ignite</button>`,
      css: "",
      js: "const btn = document.querySelector('#fire');\nif (btn) btn.addEventListener('click', () => console.log('Ignite'));",
    },
  },
  {
    id: "lesson-3-3-5",
    moduleId: "module-3-3",
    order: 5,
    title: "If Statements",
    type: "CODING",
    xpReward: 150,
    gemReward: 10,
    estimatedMin: 12,
    content: {
      type: "coding",
      objective: "Use if to make decisions.",
      hint: "If checks a condition and runs code.",
      successCondition: "hasJS:if",
    },
    starterCode: {
      html: baseHtml("If"),
      css: "",
      js: "const score = 8;\nif (score > 5) {\n  console.log('Forge strong');\n}",
    },
  },
  {
    id: "lesson-3-3-6",
    moduleId: "module-3-3",
    order: 6,
    title: "Loops in JS",
    type: "CODING",
    xpReward: 150,
    gemReward: 10,
    estimatedMin: 14,
    content: {
      type: "coding",
      objective: "Repeat work using a for loop.",
      hint: "for (let i = 0; i < 3; i++)",
      successCondition: "hasJS:for",
    },
    starterCode: {
      html: baseHtml("Loops"),
      css: "",
      js: "for (let i = 0; i < 3; i++) {\n  console.log('Forge', i);\n}",
    },
  },
  {
    id: "lesson-3-3-7",
    moduleId: "module-3-3",
    order: 7,
    title: "Input and Output",
    type: "CODING",
    xpReward: 150,
    gemReward: 10,
    estimatedMin: 14,
    content: {
      type: "coding",
      objective: "Read an input value and use it.",
      hint: "Use .value and textContent.",
      successCondition: "hasJS:value",
    },
    starterCode: {
      html: `${baseHtml("Input")}
  <input id=\"name\" placeholder=\"Name\" />
  <p id=\"output\"></p>`,
      css: "",
      js: "const input = document.querySelector('#name');\nconst out = document.querySelector('#output');\nif (input && out) out.textContent = input.value;",
    },
  },
  {
    id: "lesson-3-3-8",
    moduleId: "module-3-3",
    order: 8,
    title: "Color Switcher",
    type: "CHALLENGE",
    xpReward: 250,
    gemReward: 20,
    estimatedMin: 16,
    content: {
      type: "challenge",
      objective: "Toggle a class on click.",
      hint: "Use classList.toggle.",
      successCondition: "hasJS:classList",
    },
    starterCode: {
      html: `${baseHtml("Switch")}
  <button id=\"toggle\">Toggle</button>
  <div id=\"panel\">Panel</div>`,
      css: "#panel.active { background: #ff994a; }",
      js: "const panel = document.querySelector('#panel');\nconst btn = document.querySelector('#toggle');\nif (btn && panel) btn.addEventListener('click', () => panel.classList.toggle('active'));",
    },
  },
  {
    id: "lesson-3-3-9",
    moduleId: "module-3-3",
    order: 9,
    title: "Score Counter",
    type: "CHALLENGE",
    xpReward: 250,
    gemReward: 20,
    estimatedMin: 16,
    content: {
      type: "challenge",
      objective: "Update a number on the page.",
      hint: "Use textContent.",
      successCondition: "hasJS:textContent",
    },
    starterCode: {
      html: `${baseHtml("Counter")}
  <p id=\"score\">0</p>`,
      css: "",
      js: "const score = document.querySelector('#score');\nif (score) score.textContent = '1';",
    },
  },
  {
    id: "lesson-3-3-10",
    moduleId: "module-3-3",
    order: 10,
    title: "Interactive Mini Site",
    type: "PROJECT",
    xpReward: 350,
    gemReward: 30,
    estimatedMin: 20,
    content: {
      type: "project",
      objective: "Build a page with a button that changes content.",
      hint: "Use addEventListener to update text.",
      successCondition: "hasJS:addEventListener",
    },
    starterCode: {
      html: `${baseHtml("Mini Site")}
  <h1 id=\"headline\">Forge</h1>
  <button id=\"swap\">Change</button>`,
      css: "",
      js: "const headline = document.querySelector('#headline');\nconst btn = document.querySelector('#swap');\nif (btn && headline) btn.addEventListener('click', () => (headline.textContent = 'Forge Builder'));",
    },
  },
  {
    id: "lesson-3-4-1",
    moduleId: "module-3-4",
    order: 1,
    title: "Layout Blueprint",
    type: "STORY",
    xpReward: 100,
    gemReward: 5,
    estimatedMin: 10,
    content: {
      type: "story",
      objective: "Plan a layout using main sections.",
      hint: "Use <main> to hold the core content.",
      successCondition: "hasHTML:<main",
    },
    starterCode: { html: baseHtml("Blueprint"), css: "", js: "" },
  },
  {
    id: "lesson-3-4-2",
    moduleId: "module-3-4",
    order: 2,
    title: "Hero Section",
    type: "CODING",
    xpReward: 200,
    gemReward: 15,
    estimatedMin: 16,
    content: {
      type: "coding",
      objective: "Create a hero section with a background.",
      hint: "Use a section with background.",
      successCondition: "hasHTML:<section|hasCSS:background",
    },
    starterCode: {
      html: `${baseHtml("Hero")}
  <section class=\"hero\">
    <h1>Forge</h1>
  </section>`,
      css: ".hero { background: #111018; color: #fff; padding: 40px; }",
      js: "",
    },
  },
  {
    id: "lesson-3-4-3",
    moduleId: "module-3-4",
    order: 3,
    title: "Feature Grid",
    type: "CODING",
    xpReward: 200,
    gemReward: 15,
    estimatedMin: 16,
    content: {
      type: "coding",
      objective: "Layout features with CSS grid.",
      hint: "Use display: grid.",
      successCondition: "hasCSS:grid",
    },
    starterCode: {
      html: `${baseHtml("Grid")}
  <div class=\"grid\">
    <div>One</div>
    <div>Two</div>
  </div>`,
      css: ".grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }",
      js: "",
    },
  },
  {
    id: "lesson-3-4-4",
    moduleId: "module-3-4",
    order: 4,
    title: "Navigation Bar",
    type: "CODING",
    xpReward: 200,
    gemReward: 15,
    estimatedMin: 16,
    content: {
      type: "coding",
      objective: "Build a nav bar with flex.",
      hint: "Use <nav> and display: flex.",
      successCondition: "hasHTML:<nav|hasCSS:flex",
    },
    starterCode: {
      html: `${baseHtml("Nav")}
  <nav class=\"nav\">
    <span>Forge</span>
    <span>About</span>
  </nav>`,
      css: ".nav { display: flex; gap: 16px; }",
      js: "",
    },
  },
  {
    id: "lesson-3-4-5",
    moduleId: "module-3-4",
    order: 5,
    title: "Footer Build",
    type: "CODING",
    xpReward: 200,
    gemReward: 15,
    estimatedMin: 16,
    content: {
      type: "coding",
      objective: "Add a footer with padding.",
      hint: "Use <footer> and padding.",
      successCondition: "hasHTML:<footer|hasCSS:padding",
    },
    starterCode: {
      html: `${baseHtml("Footer")}
  <footer class=\"footer\">Built by Forge</footer>`,
      css: ".footer { padding: 16px; background: #1b1a27; color: #fff; }",
      js: "",
    },
  },
  {
    id: "lesson-3-4-6",
    moduleId: "module-3-4",
    order: 6,
    title: "Gallery Cards",
    type: "CODING",
    xpReward: 200,
    gemReward: 15,
    estimatedMin: 16,
    content: {
      type: "coding",
      objective: "Design cards with shadows.",
      hint: "Use <article> and box-shadow.",
      successCondition: "hasHTML:<article|hasCSS:box-shadow",
    },
    starterCode: {
      html: `${baseHtml("Cards")}
  <article class=\"card\">Forge Card</article>`,
      css: ".card { box-shadow: 0 12px 30px rgba(0,0,0,0.2); padding: 16px; }",
      js: "",
    },
  },
  {
    id: "lesson-3-4-7",
    moduleId: "module-3-4",
    order: 7,
    title: "Responsive Touch",
    type: "CHALLENGE",
    xpReward: 250,
    gemReward: 20,
    estimatedMin: 18,
    content: {
      type: "challenge",
      objective: "Add a media query for smaller screens.",
      hint: "Use @media (max-width: ...).",
      successCondition: "hasCSS:@media",
    },
    starterCode: {
      html: `${baseHtml("Responsive")}
  <section class=\"hero\">Forge</section>`,
      css: "@media (max-width: 600px) { .hero { padding: 16px; } }",
      js: "",
    },
  },
  {
    id: "lesson-3-4-8",
    moduleId: "module-3-4",
    order: 8,
    title: "Call to Action",
    type: "CHALLENGE",
    xpReward: 250,
    gemReward: 20,
    estimatedMin: 18,
    content: {
      type: "challenge",
      objective: "Style a button with rounded corners.",
      hint: "Use border-radius.",
      successCondition: "hasHTML:<button|hasCSS:border-radius",
    },
    starterCode: {
      html: `${baseHtml("CTA")}
  <button class=\"cta\">Start Building</button>`,
      css: ".cta { border-radius: 999px; padding: 12px 24px; }",
      js: "",
    },
  },
  {
    id: "lesson-3-4-9",
    moduleId: "module-3-4",
    order: 9,
    title: "Portfolio Layout",
    type: "CHALLENGE",
    xpReward: 250,
    gemReward: 20,
    estimatedMin: 18,
    content: {
      type: "challenge",
      objective: "Build a portfolio grid layout.",
      hint: "Use sections and grid.",
      successCondition: "hasHTML:<section|hasCSS:grid",
    },
    starterCode: {
      html: `${baseHtml("Portfolio")}
  <section class=\"grid\">
    <div>Project</div>
    <div>Project</div>
  </section>`,
      css: ".grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }",
      js: "",
    },
  },
  {
    id: "lesson-3-4-10",
    moduleId: "module-3-4",
    order: 10,
    title: "Landing Page Draft",
    type: "PROJECT",
    xpReward: 350,
    gemReward: 30,
    estimatedMin: 20,
    content: {
      type: "project",
      objective: "Draft a landing page with layout blocks.",
      hint: "Combine header, sections, and grid.",
      successCondition: "hasHTML:<header|hasCSS:grid",
    },
    starterCode: {
      html: `${baseHtml("Landing")}
  <header>Forge</header>
  <section class=\"grid\">
    <div>Feature</div>
    <div>Feature</div>
  </section>`,
      css: ".grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }",
      js: "",
    },
  },
  {
    id: "lesson-3-5-1",
    moduleId: "module-3-5",
    order: 1,
    title: "Forge Fire",
    type: "STORY",
    xpReward: 100,
    gemReward: 5,
    estimatedMin: 10,
    content: {
      type: "story",
      objective: "Prepare for your Forge capstone.",
      hint: "Your site will mix structure, style, and interaction.",
      successCondition: "hasHTML:<h1",
    },
    starterCode: { html: baseHtml("Forge Fire"), css: "", js: "" },
  },
  {
    id: "lesson-3-5-2",
    moduleId: "module-3-5",
    order: 2,
    title: "Plan Your Site",
    type: "CODING",
    xpReward: 200,
    gemReward: 15,
    estimatedMin: 18,
    content: {
      type: "coding",
      objective: "Sketch the sections of your site with HTML.",
      hint: "Use <section> blocks for each area.",
      successCondition: "hasHTML:<section",
    },
    starterCode: {
      html: `${baseHtml("Plan")}
  <section>Hero</section>
  <section>Features</section>`,
      css: "",
      js: "",
    },
  },
  {
    id: "lesson-3-5-3",
    moduleId: "module-3-5",
    order: 3,
    title: "Style Your Brand",
    type: "CODING",
    xpReward: 200,
    gemReward: 15,
    estimatedMin: 18,
    content: {
      type: "coding",
      objective: "Choose brand colors and apply them.",
      hint: "Use color and background.",
      successCondition: "hasCSS:color",
    },
    starterCode: {
      html: `${baseHtml("Brand")}
  <h1>Forge Brand</h1>`,
      css: "body { color: #ff994a; background: #111018; }",
      js: "",
    },
  },
  {
    id: "lesson-3-5-4",
    moduleId: "module-3-5",
    order: 4,
    title: "Add Interactivity",
    type: "CODING",
    xpReward: 200,
    gemReward: 15,
    estimatedMin: 18,
    content: {
      type: "coding",
      objective: "Add a click interaction to your site.",
      hint: "Use addEventListener on a button.",
      successCondition: "hasJS:addEventListener",
    },
    starterCode: {
      html: `${baseHtml("Interact")}
  <button id=\"ignite\">Ignite</button>`,
      css: "",
      js: "const btn = document.querySelector('#ignite');\nif (btn) btn.addEventListener('click', () => console.log('Ignite'));",
    },
  },
  {
    id: "lesson-3-5-5",
    moduleId: "module-3-5",
    order: 5,
    title: "Navigation Logic",
    type: "CODING",
    xpReward: 200,
    gemReward: 15,
    estimatedMin: 18,
    content: {
      type: "coding",
      objective: "Hook up navigation links with JavaScript.",
      hint: "Use querySelector to grab links.",
      successCondition: "hasJS:querySelector",
    },
    starterCode: {
      html: `${baseHtml("Navigate")}
  <nav><a id=\"home\" href=\"#\">Home</a></nav>`,
      css: "",
      js: "const link = document.querySelector('#home');\nif (link) link.addEventListener('click', (event) => event.preventDefault());",
    },
  },
  {
    id: "lesson-3-5-6",
    moduleId: "module-3-5",
    order: 6,
    title: "Showcase Challenge",
    type: "CHALLENGE",
    xpReward: 350,
    gemReward: 30,
    estimatedMin: 20,
    content: {
      type: "challenge",
      objective: "Design a gallery card with image and shadow.",
      hint: "Use <img> and box-shadow.",
      successCondition: "hasHTML:<img|hasCSS:box-shadow",
    },
    starterCode: {
      html: `${baseHtml("Showcase")}
  <div class=\"card\">
    <img src=\"https://placehold.co/400x240\" alt=\"Showcase\" />
  </div>`,
      css: ".card { box-shadow: 0 12px 30px rgba(0,0,0,0.2); }",
      js: "",
    },
  },
  {
    id: "lesson-3-5-7",
    moduleId: "module-3-5",
    order: 7,
    title: "Accessibility Pass",
    type: "CHALLENGE",
    xpReward: 300,
    gemReward: 25,
    estimatedMin: 18,
    content: {
      type: "challenge",
      objective: "Add alt text to all images.",
      hint: 'Use alt="..." for images.',
      successCondition: "hasHTML:alt=",
    },
    starterCode: {
      html: `${baseHtml("Accessible")}
  <img src=\"https://placehold.co/200x120\" alt=\"Forge icon\" />`,
      css: "",
      js: "",
    },
  },
  {
    id: "lesson-3-5-8",
    moduleId: "module-3-5",
    order: 8,
    title: "Performance Polish",
    type: "CHALLENGE",
    xpReward: 300,
    gemReward: 25,
    estimatedMin: 18,
    content: {
      type: "challenge",
      objective: "Add a small transition to smooth UI changes.",
      hint: "Use transition for hover effects.",
      successCondition: "hasCSS:transition",
    },
    starterCode: {
      html: `${baseHtml("Polish")}
  <button class=\"cta\">Forge</button>`,
      css: ".cta { transition: transform 0.2s ease; }",
      js: "",
    },
  },
  {
    id: "lesson-3-5-9",
    moduleId: "module-3-5",
    order: 9,
    title: "Pre-Launch Review",
    type: "PROJECT",
    xpReward: 400,
    gemReward: 35,
    estimatedMin: 22,
    content: {
      type: "project",
      objective: "Review and polish your layout with a footer.",
      hint: "Add a footer and background styles.",
      successCondition: "hasHTML:<footer|hasCSS:background",
    },
    starterCode: {
      html: `${baseHtml("Review")}
  <footer>Forge Footer</footer>`,
      css: "footer { background: #111018; color: #fff; padding: 12px; }",
      js: "",
    },
  },
  {
    id: "lesson-3-5-10",
    moduleId: "module-3-5",
    order: 10,
    title: "Forge Masterwork",
    type: "PROJECT",
    xpReward: 600,
    gemReward: 60,
    estimatedMin: 30,
    content: {
      type: "project",
      objective: "Build a full web project with structure, style, and JS.",
      hint: "Use background styles and at least one JS event.",
      successCondition: "hasJS:addEventListener|hasCSS:background",
    },
    starterCode: {
      html: `${baseHtml("Masterwork")}
  <h1>Forge Masterwork</h1>
  <button id=\"spark\">Spark</button>`,
      css: "body { background: #111018; color: #fff; }",
      js: "const btn = document.querySelector('#spark');\nif (btn) btn.addEventListener('click', () => console.log('Forge'));",
    },
  },
];

async function main() {
  await prisma.phase.upsert({
    where: { number: 3 },
    update: {},
    create: {
      id: "phase-3",
      number: 3,
      title: "The Forge",
      kingdom: "Web Wilderness",
      mentor: "Forge",
      ageMin: 9,
      ageMax: 12,
      colorHex: "#FF994A",
    },
  });

  const modules = [
    {
      id: "module-3-1",
      order: 1,
      title: "HTML Foundations",
      description: "Structure real web pages with HTML.",
      weeks: 2,
      skills: ["HTML structure", "Headings", "Links", "Lists", "Sections"],
    },
    {
      id: "module-3-2",
      order: 2,
      title: "CSS Styling",
      description: "Bring pages to life with color and layout.",
      weeks: 2,
      skills: ["Color", "Typography", "Spacing", "Flexbox", "Shadows"],
    },
    {
      id: "module-3-3",
      order: 3,
      title: "JavaScript Essentials",
      description: "Make websites interactive with JavaScript.",
      weeks: 2,
      skills: ["Variables", "DOM", "Events", "Conditions", "Loops"],
    },
    {
      id: "module-3-4",
      order: 4,
      title: "Real Page Layouts",
      description: "Combine HTML and CSS into full layouts.",
      weeks: 2,
      skills: ["Hero layouts", "Grid", "Navigation", "Responsive design", "Cards"],
    },
    {
      id: "module-3-5",
      order: 5,
      title: "Forge Capstone",
      description: "Build and publish a full web project.",
      weeks: 2,
      skills: ["Project planning", "Styling systems", "Interaction", "Polish", "Publishing"],
    },
  ];

  for (const moduleEntry of modules) {
    await prisma.module.upsert({
      where: { id: moduleEntry.id },
      update: {
        title: moduleEntry.title,
        description: moduleEntry.description,
        order: moduleEntry.order,
        weeks: moduleEntry.weeks,
        skills: moduleEntry.skills,
        phaseId: "phase-3",
      },
      create: {
        id: moduleEntry.id,
        phaseId: "phase-3",
        order: moduleEntry.order,
        title: moduleEntry.title,
        description: moduleEntry.description,
        weeks: moduleEntry.weeks,
        skills: moduleEntry.skills,
      },
    });
  }

  for (const lesson of lessons) {
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
        estimatedMin: lesson.estimatedMin,
        starterCode: lesson.starterCode,
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
        estimatedMin: lesson.estimatedMin,
        starterCode: lesson.starterCode,
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
