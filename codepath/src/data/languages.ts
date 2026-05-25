export type Level = {
  id: number
  title: string
  concept: string
  challenge: string
}

export type Step = {
  name: string
  detail: string
  resources: string[]
  levels: Level[]
}

export type Language = {
  id: string
  name: string
  emoji: string
  desc: string
  steps: Step[]
}

export const languages: Record<string, Language> = {
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    emoji: '🌐',
    desc: 'The language of the web — runs in every browser, powers interactive sites and full-stack apps. Huge job market, fast visible results.',
    steps: [
      {
        name: 'HTML & CSS basics',
        detail: 'Build your first webpage',
        resources: ['freeCodeCamp', 'MDN Docs'],
        levels: [
          { id: 1, title: 'What is HTML?', concept: 'Learn what HTML is and how web pages are structured', challenge: 'Create a simple HTML page with a heading and a paragraph' },
          { id: 2, title: 'HTML Tags', concept: 'Learn the most common HTML tags', challenge: 'Build a page with a heading, paragraph, list, and a link' },
          { id: 3, title: 'What is CSS?', concept: 'Learn how CSS styles HTML elements', challenge: 'Style your HTML page with colors, fonts, and spacing' },
          { id: 4, title: 'CSS Selectors', concept: 'Learn how to target elements with CSS selectors', challenge: 'Style specific elements using class and ID selectors' },
          { id: 5, title: 'Layout basics', concept: 'Learn flexbox for laying out elements', challenge: 'Create a centered card layout using flexbox' },
        ]
      },
      {
        name: 'JavaScript fundamentals',
        detail: 'Variables, functions, loops, DOM',
        resources: ['javascript.info', 'Eloquent JS'],
        levels: [
          { id: 1, title: 'Variables', concept: 'Learn var, let, and const', challenge: 'Declare variables for your name, age, and favorite color and log them' },
          { id: 2, title: 'Data Types', concept: 'Learn strings, numbers, booleans, arrays, objects', challenge: 'Create an object representing yourself with 5 properties' },
          { id: 3, title: 'Functions', concept: 'Learn how to write and call functions', challenge: 'Write a function that takes two numbers and returns their sum' },
          { id: 4, title: 'If Statements', concept: 'Learn conditional logic', challenge: 'Write a function that checks if a number is positive, negative, or zero' },
          { id: 5, title: 'Loops', concept: 'Learn for and while loops', challenge: 'Write a loop that prints numbers 1 to 10' },
          { id: 6, title: 'DOM Manipulation', concept: 'Learn how to interact with HTML using JavaScript', challenge: 'Write code that changes the text of a heading when a button is clicked' },
        ]
      },
      {
        name: 'React framework',
        detail: 'Build dynamic UIs',
        resources: ['react.dev', 'Scrimba'],
        levels: [
          { id: 1, title: 'What is React?', concept: 'Learn what React is and why it exists', challenge: 'Create a simple React component that displays Hello World' },
          { id: 2, title: 'Components', concept: 'Learn how to create and use React components', challenge: 'Create a Card component that accepts a title and description as props' },
          { id: 3, title: 'Props', concept: 'Learn how to pass data between components', challenge: 'Create a Profile component that shows name, age, and avatar' },
          { id: 4, title: 'State', concept: 'Learn useState hook for dynamic data', challenge: 'Build a counter that increments and decrements on button click' },
          { id: 5, title: 'Events', concept: 'Learn how to handle user events in React', challenge: 'Build a form that logs input values when submitted' },
        ]
      },
      {
        name: 'Node.js & backend',
        detail: 'APIs, databases, server logic',
        resources: ['The Odin Project'],
        levels: [
          { id: 1, title: 'What is Node.js?', concept: 'Learn how JavaScript runs on the server', challenge: 'Create a simple Node.js script that logs Hello Server' },
          { id: 2, title: 'npm & packages', concept: 'Learn how to use npm to install packages', challenge: 'Install and use the chalk package to log colored text' },
          { id: 3, title: 'Express basics', concept: 'Learn how to create a web server with Express', challenge: 'Create an Express server with a route that returns Hello World' },
          { id: 4, title: 'REST APIs', concept: 'Learn how to build a REST API', challenge: 'Create a simple API with GET and POST routes for a list of items' },
          { id: 5, title: 'Databases', concept: 'Learn how to connect to a database', challenge: 'Connect your Express app to a database and save user data' },
        ]
      },
      {
        name: 'Deploy a project',
        detail: 'Portfolio piece on GitHub + Vercel',
        resources: ['Vercel', 'GitHub'],
        levels: [
          { id: 1, title: 'Git basics', concept: 'Learn git add, commit, push', challenge: 'Initialize a git repo, make a commit, and push to GitHub' },
          { id: 2, title: 'GitHub', concept: 'Learn how to use GitHub for collaboration', challenge: 'Create a repository, add a README, and push your project' },
          { id: 3, title: 'Deploy to Vercel', concept: 'Learn how to deploy a project live', challenge: 'Connect your GitHub repo to Vercel and deploy your first project' },
        ]
      },
    ],
  },
  python: {
    id: 'python',
    name: 'Python',
    emoji: '🐍',
    desc: 'Clear, readable syntax perfect for data science, AI/ML, scripting, and automation. The most popular first language for a reason.',
    steps: [
      {
        name: 'Python basics',
        detail: 'Variables, lists, dicts, functions',
        resources: ['Python.org', 'Automate the Boring Stuff'],
        levels: [
          { id: 1, title: 'Variables', concept: 'Learn how to store data in Python', challenge: 'Create variables for your name, age, and city and print them' },
          { id: 2, title: 'Strings', concept: 'Learn string operations and formatting', challenge: 'Write a function that returns a greeting using an f-string' },
          { id: 3, title: 'Lists', concept: 'Learn how to work with lists', challenge: 'Create a list of 5 foods, add one, remove one, and print the result' },
          { id: 4, title: 'Dictionaries', concept: 'Learn how to use key-value pairs', challenge: 'Create a dictionary for a person with name, age, and city' },
          { id: 5, title: 'Functions', concept: 'Learn how to define and call functions', challenge: 'Write a function that calculates the area of a rectangle' },
          { id: 6, title: 'Loops', concept: 'Learn for and while loops in Python', challenge: 'Write a loop that prints the squares of numbers 1 to 10' },
        ]
      },
      {
        name: 'Data libraries',
        detail: 'NumPy, Pandas, Matplotlib',
        resources: ['Kaggle Learn', 'Real Python'],
        levels: [
          { id: 1, title: 'NumPy basics', concept: 'Learn how to work with arrays in NumPy', challenge: 'Create a NumPy array and perform basic math operations on it' },
          { id: 2, title: 'Pandas DataFrames', concept: 'Learn how to load and explore data', challenge: 'Load a CSV file and display the first 5 rows' },
          { id: 3, title: 'Data cleaning', concept: 'Learn how to handle missing data', challenge: 'Find and fill missing values in a dataset' },
          { id: 4, title: 'Matplotlib', concept: 'Learn how to create charts', challenge: 'Create a line chart showing data over time' },
          { id: 5, title: 'Data analysis', concept: 'Learn how to derive insights from data', challenge: 'Analyze a dataset and find the top 3 highest values' },
        ]
      },
      {
        name: 'Machine learning intro',
        detail: 'Scikit-learn, basic models',
        resources: ['fast.ai', 'Coursera ML'],
        levels: [
          { id: 1, title: 'What is ML?', concept: 'Learn the basics of machine learning', challenge: 'Explain in your own words what supervised learning is' },
          { id: 2, title: 'Linear regression', concept: 'Learn how to predict values', challenge: 'Train a linear regression model on a simple dataset' },
          { id: 3, title: 'Classification', concept: 'Learn how to classify data', challenge: 'Train a classifier to predict if an email is spam' },
          { id: 4, title: 'Model evaluation', concept: 'Learn how to measure model performance', challenge: 'Calculate accuracy and confusion matrix for your model' },
          { id: 5, title: 'Your first pipeline', concept: 'Learn how to chain ML steps together', challenge: 'Build a complete ML pipeline from data to prediction' },
        ]
      },
      {
        name: 'Your first data project',
        detail: 'Analyze a real dataset end-to-end',
        resources: ['Kaggle Datasets'],
        levels: [
          { id: 1, title: 'Pick a dataset', concept: 'Learn where to find real datasets', challenge: 'Find and download a dataset from Kaggle on a topic you like' },
          { id: 2, title: 'Explore the data', concept: 'Learn how to understand a new dataset', challenge: 'Write code to show shape, columns, and basic stats of your dataset' },
          { id: 3, title: 'Visualize it', concept: 'Create charts to find patterns', challenge: 'Create 3 charts that reveal something interesting about your data' },
          { id: 4, title: 'Draw conclusions', concept: 'Learn how to tell a story with data', challenge: 'Write 3 insights you discovered from your dataset' },
          { id: 5, title: 'Present it', concept: 'Package your analysis for sharing', challenge: 'Create a Jupyter notebook that walks through your full analysis' },
        ]
      },
      {
        name: 'Share on GitHub',
        detail: 'Jupyter notebooks + README',
        resources: ['GitHub Docs'],
        levels: [
          { id: 1, title: 'Git for Python', concept: 'Learn how to version control Python projects', challenge: 'Create a .gitignore for Python and push your project to GitHub' },
          { id: 2, title: 'Write a README', concept: 'Learn how to document your project', challenge: 'Write a README with project description, setup, and usage' },
          { id: 3, title: 'Share your work', concept: 'Learn how to showcase your project', challenge: 'Add your GitHub project link to your LinkedIn or portfolio' },
        ]
      },
    ],
  },
  swift: {
    id: 'swift',
    name: 'Swift',
    emoji: '📱',
    desc: "Apple's modern language for iOS and macOS apps. Clean syntax, powerful tooling with Xcode, and direct path to the App Store.",
    steps: [
      {
        name: 'Swift basics',
        detail: 'Types, optionals, closures',
        resources: ['Swift.org', 'Hacking with Swift'],
        levels: [
          { id: 1, title: 'Variables & Constants', concept: 'Learn var and let in Swift', challenge: 'Declare a constant for your name and a variable for your score' },
          { id: 2, title: 'Data Types', concept: 'Learn Int, String, Bool, Double', challenge: 'Create variables of each type and print their values' },
          { id: 3, title: 'Optionals', concept: 'Learn how Swift handles nil values safely', challenge: 'Create an optional string and safely unwrap it' },
          { id: 4, title: 'Functions', concept: 'Learn how to write functions in Swift', challenge: 'Write a function that takes a name and returns a greeting' },
          { id: 5, title: 'Closures', concept: 'Learn Swift closures and how they work', challenge: 'Write a closure that squares a number and use it with map' },
        ]
      },
      {
        name: 'SwiftUI fundamentals',
        detail: 'Build your first screen',
        resources: ['Apple Tutorials', '100 Days of SwiftUI'],
        levels: [
          { id: 1, title: 'Your first View', concept: 'Learn how to create a SwiftUI view', challenge: 'Create a view that shows your name in large bold text' },
          { id: 2, title: 'Stacks', concept: 'Learn VStack, HStack, and ZStack', challenge: 'Create a profile card using stacks with name, age, and emoji' },
          { id: 3, title: 'Buttons & State', concept: 'Learn @State and Button', challenge: 'Build a counter app with + and - buttons' },
          { id: 4, title: 'Lists', concept: 'Learn how to display lists of data', challenge: 'Create a List view showing 5 of your favorite movies' },
          { id: 5, title: 'Navigation', concept: 'Learn NavigationView and NavigationLink', challenge: 'Build a two-screen app where tapping an item shows its details' },
        ]
      },
      {
        name: 'App architecture',
        detail: 'State, data flow, MVVM',
        resources: ['SwiftUI by Example'],
        levels: [
          { id: 1, title: 'MVVM pattern', concept: 'Learn Model-View-ViewModel architecture', challenge: 'Refactor a simple view to use a ViewModel class' },
          { id: 2, title: 'ObservableObject', concept: 'Learn how to share state across views', challenge: 'Create an ObservableObject and use it in two different views' },
          { id: 3, title: 'Environment', concept: 'Learn how to pass data through the view hierarchy', challenge: 'Use @EnvironmentObject to share a user model app-wide' },
        ]
      },
      {
        name: 'Publish to TestFlight',
        detail: 'Real device testing',
        resources: ['Apple Developer Docs'],
        levels: [
          { id: 1, title: 'Apple Developer Account', concept: 'Learn how to set up your developer account', challenge: 'Create an Apple Developer account and set up signing in Xcode' },
          { id: 2, title: 'Build for device', concept: 'Learn how to run your app on a real iPhone', challenge: 'Connect your iPhone and run your app on the device' },
          { id: 3, title: 'Upload to TestFlight', concept: 'Learn how to distribute your app for testing', challenge: 'Archive your app and upload it to TestFlight' },
        ]
      },
      {
        name: 'App Store launch',
        detail: 'Portfolio + first users',
        resources: ['App Store Connect'],
        levels: [
          { id: 1, title: 'App Store listing', concept: 'Learn how to create your App Store page', challenge: 'Write your app name, description, and keywords' },
          { id: 2, title: 'Screenshots', concept: 'Learn how to create App Store screenshots', challenge: 'Create screenshots for iPhone and iPad using the Simulator' },
          { id: 3, title: 'Submit for review', concept: 'Learn the App Store review process', challenge: 'Submit your app for App Store review' },
        ]
      },
    ],
  },
  csharp: {
    id: 'csharp',
    name: 'C# / Unity',
    emoji: '🎮',
    desc: 'The go-to for game dev with Unity. Also widely used for enterprise software. Structured, powerful, great job market in gaming.',
    steps: [
      {
        name: 'C# basics',
        detail: 'Syntax, OOP, classes',
        resources: ['Microsoft Learn', 'C# Yellow Book'],
        levels: [
          { id: 1, title: 'Variables & Types', concept: 'Learn C# data types and variables', challenge: 'Declare int, string, bool, and float variables and print them' },
          { id: 2, title: 'If Statements', concept: 'Learn conditional logic in C#', challenge: 'Write a program that checks if a number is even or odd' },
          { id: 3, title: 'Loops', concept: 'Learn for, while, and foreach loops', challenge: 'Write a loop that prints a multiplication table for 5' },
          { id: 4, title: 'Functions', concept: 'Learn how to write methods in C#', challenge: 'Write a method that calculates and returns the factorial of a number' },
          { id: 5, title: 'Classes & Objects', concept: 'Learn object-oriented programming basics', challenge: 'Create a Player class with name, health, and attack properties' },
          { id: 6, title: 'Inheritance', concept: 'Learn how classes can inherit from each other', challenge: 'Create an Enemy class that inherits from a base Character class' },
        ]
      },
      {
        name: 'Unity editor basics',
        detail: 'GameObjects, scenes, physics',
        resources: ['Unity Learn', 'Brackeys YouTube'],
        levels: [
          { id: 1, title: 'Unity interface', concept: 'Learn the Unity editor layout and panels', challenge: 'Create a new Unity project and identify the Scene, Game, Hierarchy, and Inspector panels' },
          { id: 2, title: 'GameObjects', concept: 'Learn what GameObjects are and how to use them', challenge: 'Create a cube, sphere, and plane in your scene' },
          { id: 3, title: 'Components', concept: 'Learn how components add behavior to GameObjects', challenge: 'Add a Rigidbody component to your cube and watch it fall' },
          { id: 4, title: 'Scripting', concept: 'Learn how to attach C# scripts to GameObjects', challenge: 'Write a script that moves a cube forward when you press the arrow key' },
          { id: 5, title: 'Physics', concept: 'Learn Unity physics and collisions', challenge: 'Set up a scene where a ball rolls down a ramp and hits a wall' },
        ]
      },
      {
        name: 'Your first 2D game',
        detail: 'Platformer or top-down shooter',
        resources: ['Unity Tutorials'],
        levels: [
          { id: 1, title: 'Scene setup', concept: 'Learn how to set up a 2D scene in Unity', challenge: 'Create a 2D project with a ground platform and a player sprite' },
          { id: 2, title: 'Player movement', concept: 'Learn how to move a 2D character', challenge: 'Write a script that moves your player left and right with arrow keys' },
          { id: 3, title: 'Jumping', concept: 'Learn how to add jumping with physics', challenge: 'Add jumping to your player with a Rigidbody2D and ground check' },
          { id: 4, title: 'Enemies', concept: 'Learn how to create basic enemy behavior', challenge: 'Create an enemy that moves back and forth on a platform' },
          { id: 5, title: 'Score & UI', concept: 'Learn how to add UI to your game', challenge: 'Add a score counter that increases when you collect a coin' },
        ]
      },
      {
        name: 'Level design & polish',
        detail: 'Audio, UI, particles',
        resources: ['Game Dev TV'],
        levels: [
          { id: 1, title: 'Level design', concept: 'Learn principles of good level design', challenge: 'Design and build a complete level with a start and end point' },
          { id: 2, title: 'Audio', concept: 'Learn how to add sound effects and music', challenge: 'Add a jump sound effect and background music to your game' },
          { id: 3, title: 'Particles', concept: 'Learn how to use Unity particle systems', challenge: 'Add a particle explosion effect when an enemy is defeated' },
          { id: 4, title: 'Game feel', concept: 'Learn screen shake, animation, and juice', challenge: 'Add screen shake when the player takes damage' },
        ]
      },
      {
        name: 'Publish on itch.io',
        detail: 'Share your game with the world',
        resources: ['itch.io'],
        levels: [
          { id: 1, title: 'Build your game', concept: 'Learn how to build a Unity game for WebGL', challenge: 'Build your game for WebGL in Unity Build Settings' },
          { id: 2, title: 'Create itch.io page', concept: 'Learn how to set up your game page', challenge: 'Create an itch.io account and set up your game page with description and screenshots' },
          { id: 3, title: 'Upload & publish', concept: 'Learn how to upload and share your game', challenge: 'Upload your WebGL build and publish your game publicly' },
        ]
      },
    ],
  },
}

export function recommend(goal: string, math: string): string {
  if (goal === 'data') return 'python'
  if (goal === 'mobile') return 'swift'
  if (goal === 'games') return 'csharp'
  if (math === 'high') return 'python'
  return 'javascript'
}