export type ForgeTrialSeed = {
  title: string;
  description: string;
  challenge: {
    type: "challenge";
    objective: string;
    hint: string;
    successCondition: string;
  };
};

export const FORGE_TRIAL_SEEDS: ForgeTrialSeed[] = [
  {
    title: "Forge Trial 01: Signal Tower",
    description: "Send a clear signal with print.",
    challenge: {
      type: "challenge",
      objective: "Print a message that announces your guild.",
      hint: "Use print() at least once.",
      successCondition: "hasPython:print",
    },
  },
  {
    title: "Forge Trial 02: The Gatekeeper",
    description: "Use if to protect the gate.",
    challenge: {
      type: "challenge",
      objective: "Check a condition with if and respond.",
      hint: "Try if score > 5.",
      successCondition: "hasPython:if",
    },
  },
  {
    title: "Forge Trial 03: Loop Lift",
    description: "Move the lift with a for loop.",
    challenge: {
      type: "challenge",
      objective: "Loop and print a count.",
      hint: "Use for with range().",
      successCondition: "hasPython:for",
    },
  },
  {
    title: "Forge Trial 04: Input Relay",
    description: "Collect a message from the user.",
    challenge: {
      type: "challenge",
      objective: "Ask a question using input().",
      hint: "Store the answer in a variable.",
      successCondition: "hasPython:input",
    },
  },
  {
    title: "Forge Trial 05: Number Forge",
    description: "Work with numbers and math.",
    challenge: {
      type: "challenge",
      objective: "Calculate a result using + or *.",
      hint: "Try 4 + 6 or 3 * 5.",
      successCondition: "hasPython:+|hasPython:*",
    },
  },
  {
    title: "Forge Trial 06: List Builder",
    description: "Grow a list with append().",
    challenge: {
      type: "challenge",
      objective: "Create a list and append at least one item.",
      hint: "Use items.append('value').",
      successCondition: "hasPython:append",
    },
  },
  {
    title: "Forge Trial 07: Badge Counter",
    description: "Count your resources with len().",
    challenge: {
      type: "challenge",
      objective: "Use len() to count list items.",
      hint: "Try len(items).",
      successCondition: "hasPython:len",
    },
  },
  {
    title: "Forge Trial 08: Star Sorter",
    description: "Find the top value.",
    challenge: {
      type: "challenge",
      objective: "Use max() to find the highest number.",
      hint: "max(scores) gives the biggest value.",
      successCondition: "hasPython:max",
    },
  },
  {
    title: "Forge Trial 09: While Watch",
    description: "Keep the watch running with while.",
    challenge: {
      type: "challenge",
      objective: "Repeat a task with a while loop.",
      hint: "Remember to change the counter.",
      successCondition: "hasPython:while",
    },
  },
  {
    title: "Forge Trial 10: Decision Circuit",
    description: "Choose between paths with elif.",
    challenge: {
      type: "challenge",
      objective: "Build a decision with if/elif.",
      hint: "Use elif to add a second condition.",
      successCondition: "hasPython:elif",
    },
  },
  {
    title: "Forge Trial 11: Console Echo",
    description: "Echo the user input.",
    challenge: {
      type: "challenge",
      objective: "Ask the user for input and print it back.",
      hint: "Use input() and print().",
      successCondition: "hasPython:input|hasPython:print",
    },
  },
  {
    title: "Forge Trial 12: The Loop Forge",
    description: "Repeat a phrase 5 times.",
    challenge: {
      type: "challenge",
      objective: "Print a phrase in a loop.",
      hint: "for i in range(5): print(...)",
      successCondition: "hasPython:for",
    },
  },
  {
    title: "Forge Trial 13: Comparison Lens",
    description: "Compare values like a judge.",
    challenge: {
      type: "challenge",
      objective: "Use > or < to compare two numbers.",
      hint: "Try 7 > 3.",
      successCondition: "hasPython:>|hasPython:<",
    },
  },
  {
    title: "Forge Trial 14: Boolean Beacon",
    description: "Use True and False.",
    challenge: {
      type: "challenge",
      objective: "Print a boolean value.",
      hint: "Try flag = True.",
      successCondition: "hasPython:True|hasPython:False",
    },
  },
  {
    title: "Forge Trial 15: Builder's Greeting",
    description: "Craft a custom greeting.",
    challenge: {
      type: "challenge",
      objective: "Ask for a name and greet the user.",
      hint: "Combine input() and +.",
      successCondition: "hasPython:input|hasPython:+",
    },
  },
  {
    title: "Forge Trial 16: Loop Control",
    description: "Skip a step with continue.",
    challenge: {
      type: "challenge",
      objective: "Use continue inside a loop.",
      hint: "continue jumps to the next loop step.",
      successCondition: "hasPython:continue",
    },
  },
  {
    title: "Forge Trial 17: Emergency Stop",
    description: "End a loop with break.",
    challenge: {
      type: "challenge",
      objective: "Use break inside a loop.",
      hint: "break exits the loop.",
      successCondition: "hasPython:break",
    },
  },
  {
    title: "Forge Trial 18: List Patrol",
    description: "Loop through a list.",
    challenge: {
      type: "challenge",
      objective: "Use a for loop over a list.",
      hint: "for item in items:",
      successCondition: "hasPython:for|hasPython:[]",
    },
  },
  {
    title: "Forge Trial 19: Input Sensor",
    description: "Capture user input for a decision.",
    challenge: {
      type: "challenge",
      objective: "Use input() and if in one program.",
      hint: "Ask a question then check it.",
      successCondition: "hasPython:input|hasPython:if",
    },
  },
  {
    title: "Forge Trial 20: Math Pulse",
    description: "Compute and show a result.",
    challenge: {
      type: "challenge",
      objective: "Print the result of a math expression.",
      hint: "Use +, -, or *.",
      successCondition: "hasPython:+|hasPython:-|hasPython:*",
    },
  },
  {
    title: "Forge Trial 21: Word Loop",
    description: "Loop through letters in a word.",
    challenge: {
      type: "challenge",
      objective: "Print each letter of a word.",
      hint: "for letter in word:",
      successCondition: "hasPython:for",
    },
  },
  {
    title: "Forge Trial 22: List Counter",
    description: "Count items after appending.",
    challenge: {
      type: "challenge",
      objective: "Append items then use len().",
      hint: "len(list) returns how many.",
      successCondition: "hasPython:append|hasPython:len",
    },
  },
  {
    title: "Forge Trial 23: Triple Choice",
    description: "Use if/elif/else.",
    challenge: {
      type: "challenge",
      objective: "Create three outcomes using elif.",
      hint: "if ... elif ... else ...",
      successCondition: "hasPython:elif",
    },
  },
  {
    title: "Forge Trial 24: Max Guard",
    description: "Protect the highest score.",
    challenge: {
      type: "challenge",
      objective: "Find the max value in a list.",
      hint: "Use max(scores).",
      successCondition: "hasPython:max",
    },
  },
  {
    title: "Forge Trial 25: While Countdown",
    description: "Countdown with while.",
    challenge: {
      type: "challenge",
      objective: "Use while to count down.",
      hint: "count -= 1",
      successCondition: "hasPython:while",
    },
  },
  {
    title: "Forge Trial 26: Forge Greeter",
    description: "Build a personalized greeting.",
    challenge: {
      type: "challenge",
      objective: "Ask a name and greet the user.",
      hint: "input() then print().",
      successCondition: "hasPython:input|hasPython:print",
    },
  },
  {
    title: "Forge Trial 27: List Builder II",
    description: "Create a list and add items.",
    challenge: {
      type: "challenge",
      objective: "Use append() to add at least two items.",
      hint: "list.append(value)",
      successCondition: "hasPython:append",
    },
  },
  {
    title: "Forge Trial 28: Condition Alarm",
    description: "React to a condition with if.",
    challenge: {
      type: "challenge",
      objective: "Check a value with if.",
      hint: "if score > 0:",
      successCondition: "hasPython:if",
    },
  },
  {
    title: "Forge Trial 29: Loop Beacon",
    description: "Send multiple signals in a loop.",
    challenge: {
      type: "challenge",
      objective: "Print a message inside a for loop.",
      hint: "for i in range(3):",
      successCondition: "hasPython:for",
    },
  },
  {
    title: "Forge Trial 30: Comparison Forge",
    description: "Use == to compare values.",
    challenge: {
      type: "challenge",
      objective: "Check if two values are equal.",
      hint: "Use == in an if.",
      successCondition: "hasPython:==",
    },
  },
  {
    title: "Forge Trial 31: Input Merge",
    description: "Combine input with text.",
    challenge: {
      type: "challenge",
      objective: "Ask for input and combine it with +.",
      hint: "Use 'Hello ' + name.",
      successCondition: "hasPython:input|hasPython:+",
    },
  },
  {
    title: "Forge Trial 32: Loop Escape",
    description: "Use break to exit a loop.",
    challenge: {
      type: "challenge",
      objective: "Use break inside a loop.",
      hint: "break stops the loop.",
      successCondition: "hasPython:break",
    },
  },
  {
    title: "Forge Trial 33: Forge Inventory",
    description: "Make a list of items.",
    challenge: {
      type: "challenge",
      objective: "Create a list with [] and append items.",
      hint: "items = [] then items.append()",
      successCondition: "hasPython:[]|hasPython:append",
    },
  },
  {
    title: "Forge Trial 34: While Patrol",
    description: "Loop until a condition is met.",
    challenge: {
      type: "challenge",
      objective: "Use while to repeat an action.",
      hint: "while count < 5:",
      successCondition: "hasPython:while",
    },
  },
  {
    title: "Forge Trial 35: Boolean Shield",
    description: "Use True or False.",
    challenge: {
      type: "challenge",
      objective: "Store a boolean and print it.",
      hint: "flag = True",
      successCondition: "hasPython:True|hasPython:False",
    },
  },
  {
    title: "Forge Trial 36: Input Decision",
    description: "Take input and decide.",
    challenge: {
      type: "challenge",
      objective: "Ask input and use if to respond.",
      hint: "if answer == 'yes':",
      successCondition: "hasPython:input|hasPython:if",
    },
  },
  {
    title: "Forge Trial 37: The Range Runner",
    description: "Use range in a loop.",
    challenge: {
      type: "challenge",
      objective: "Count up with range().",
      hint: "range(1, 6)",
      successCondition: "hasPython:for",
    },
  },
  {
    title: "Forge Trial 38: String Mixer",
    description: "Combine strings with +.",
    challenge: {
      type: "challenge",
      objective: "Join two strings and print.",
      hint: "text = 'A' + 'B'",
      successCondition: "hasPython:+",
    },
  },
  {
    title: "Forge Trial 39: Count the Crew",
    description: "Count list items with len.",
    challenge: {
      type: "challenge",
      objective: "Use len() on a list.",
      hint: "len(crew)",
      successCondition: "hasPython:len",
    },
  },
  {
    title: "Forge Trial 40: Max Lift",
    description: "Find the biggest number.",
    challenge: {
      type: "challenge",
      objective: "Use max() to get the highest score.",
      hint: "max(scores)",
      successCondition: "hasPython:max",
    },
  },
  {
    title: "Forge Trial 41: If Relay",
    description: "Chain two conditions.",
    challenge: {
      type: "challenge",
      objective: "Use if and elif in one program.",
      hint: "if ... elif ...",
      successCondition: "hasPython:elif",
    },
  },
  {
    title: "Forge Trial 42: Input Power",
    description: "Ask for a number and print it.",
    challenge: {
      type: "challenge",
      objective: "Use input() and print().",
      hint: "num = input('Number: ')",
      successCondition: "hasPython:input|hasPython:print",
    },
  },
  {
    title: "Forge Trial 43: Loop Builder",
    description: "Build a looped chant.",
    challenge: {
      type: "challenge",
      objective: "Repeat a phrase with a for loop.",
      hint: "for i in range(4):",
      successCondition: "hasPython:for",
    },
  },
  {
    title: "Forge Trial 44: While Engine",
    description: "Use while with a counter.",
    challenge: {
      type: "challenge",
      objective: "Count down with while.",
      hint: "count -= 1",
      successCondition: "hasPython:while",
    },
  },
  {
    title: "Forge Trial 45: Append Patrol",
    description: "Add items to a list.",
    challenge: {
      type: "challenge",
      objective: "Use append() at least once.",
      hint: "items.append('gear')",
      successCondition: "hasPython:append",
    },
  },
  {
    title: "Forge Trial 46: Equality Check",
    description: "Use == to compare.",
    challenge: {
      type: "challenge",
      objective: "Compare two values with ==.",
      hint: "if value == 3:",
      successCondition: "hasPython:==",
    },
  },
  {
    title: "Forge Trial 47: Range Sprint",
    description: "Sprint with range.",
    challenge: {
      type: "challenge",
      objective: "Loop with range() and print.",
      hint: "for i in range(3):",
      successCondition: "hasPython:for",
    },
  },
  {
    title: "Forge Trial 48: Input Builder",
    description: "Take input and build a response.",
    challenge: {
      type: "challenge",
      objective: "Use input() then print a message.",
      hint: "print('Hello ' + name)",
      successCondition: "hasPython:input|hasPython:+",
    },
  },
  {
    title: "Forge Trial 49: Loop and List",
    description: "Loop over a list.",
    challenge: {
      type: "challenge",
      objective: "Use a for loop to print list items.",
      hint: "for item in items:",
      successCondition: "hasPython:for|hasPython:[]",
    },
  },
  {
    title: "Forge Trial 50: The Final Count",
    description: "Count list items and print.",
    challenge: {
      type: "challenge",
      objective: "Use len() and print.",
      hint: "print(len(items))",
      successCondition: "hasPython:len|hasPython:print",
    },
  },
  {
    title: "Forge Trial 51: Decision Forge",
    description: "Make a simple decision.",
    challenge: {
      type: "challenge",
      objective: "Use if with input to decide.",
      hint: "if choice == 'yes':",
      successCondition: "hasPython:if|hasPython:input",
    },
  },
  {
    title: "Forge Trial 52: Champions' Signal",
    description: "Celebrate with a final message.",
    challenge: {
      type: "challenge",
      objective: "Print a celebratory message.",
      hint: "Use print() once.",
      successCondition: "hasPython:print",
    },
  },
];
