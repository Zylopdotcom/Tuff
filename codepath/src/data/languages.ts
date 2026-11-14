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
  field: string
  firstLanguage: string
  builds: string[]
  careers: string[]
  steps: Step[]
}

export const languages: Record<string, Language> = {
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    emoji: '🌐',
    desc: 'The language of the web — runs in every browser, powers interactive sites and full-stack apps. Huge job market, fast visible results.',
    field: 'Web Development',
    firstLanguage: 'JavaScript',
    builds: ['Websites and web apps', 'Online stores and dashboards', 'Full products with a frontend and a backend'],
    careers: ['Frontend developer', 'Full-stack developer', 'Freelance web developer'],
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
    field: 'Data & AI',
    firstLanguage: 'Python',
    builds: ['Data analysis and charts', 'Machine learning models', 'Scripts that automate boring work'],
    careers: ['Data analyst', 'Data scientist', 'Machine learning engineer'],
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
    field: 'iOS App Development',
    firstLanguage: 'Swift',
    builds: ['iPhone and iPad apps', 'Apps published on the App Store', 'Apple Watch and Mac apps'],
    careers: ['iOS developer', 'Mobile app developer', 'Indie app maker'],
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
    field: 'Game Development',
    firstLanguage: 'C#',
    builds: ['2D and 3D games in Unity', 'Game mechanics, levels and UI', 'Games published on itch.io'],
    careers: ['Gameplay programmer', 'Unity developer', 'Indie game developer'],
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
  kotlin: {
    id: 'kotlin',
    name: 'Kotlin / Android',
    emoji: '🤖',
    desc: "Google's recommended language for Android apps. Modern, concise, and it runs on the phones most of the world uses. You only need a normal laptop to start.",
    field: 'Android App Development',
    firstLanguage: 'Kotlin',
    builds: ['Android phone and tablet apps', 'Apps published on Google Play', 'Apps that talk to online services'],
    careers: ['Android developer', 'Mobile app developer', 'Freelance app developer'],
    steps: [
      {
        name: 'Kotlin basics',
        detail: 'Variables, functions, classes',
        resources: ['Kotlin Koans', 'kotlinlang.org'],
        levels: [
          { id: 1, title: 'Variables', concept: 'Learn val, var and basic types', challenge: 'Declare your name, age, and whether you are a student, then print them' },
          { id: 2, title: 'Functions', concept: 'Learn how to write and call functions', challenge: 'Write a function that takes two numbers and returns the larger one' },
          { id: 3, title: 'Conditions & loops', concept: 'Learn if, when, and for loops', challenge: 'Print the numbers 1 to 20, marking each as even or odd' },
          { id: 4, title: 'Null safety', concept: 'Learn how Kotlin handles missing values', challenge: 'Write a function that safely returns the length of a nullable string' },
          { id: 5, title: 'Classes', concept: 'Learn classes and data classes', challenge: 'Create a data class for a contact with a name and phone number' },
          { id: 6, title: 'Lists & maps', concept: 'Learn collections and lambdas', challenge: 'Filter a list of numbers to keep only those above 10' },
        ]
      },
      {
        name: 'Android Studio & your first screen',
        detail: 'Jetpack Compose basics',
        resources: ['Android Basics with Compose', 'developer.android.com'],
        levels: [
          { id: 1, title: 'Android Studio setup', concept: 'Learn the tool used to build Android apps', challenge: 'Create a new project and run it on the emulator' },
          { id: 2, title: 'Composables', concept: 'Learn how screens are built from small functions', challenge: 'Show a greeting with your name on screen' },
          { id: 3, title: 'Layouts', concept: 'Learn Column, Row and Box', challenge: 'Build a profile card with a picture, name, and short bio' },
          { id: 4, title: 'Buttons & state', concept: 'Learn how the screen reacts to taps', challenge: 'Build a counter that goes up each time a button is tapped' },
          { id: 5, title: 'Lists', concept: 'Learn how to show scrolling lists', challenge: 'Show a scrolling list of 20 items' },
        ]
      },
      {
        name: 'App architecture',
        detail: 'Navigation, ViewModel, saving data',
        resources: ['Android Developers guides', 'Philipp Lackner'],
        levels: [
          { id: 1, title: 'Navigation', concept: 'Learn how to move between screens', challenge: 'Build an app with a list screen and a detail screen' },
          { id: 2, title: 'ViewModel', concept: 'Learn where app logic and state live', challenge: 'Move your counter state into a ViewModel' },
          { id: 3, title: 'Saving data', concept: 'Learn how to store data on the phone with Room', challenge: 'Save a list of notes so they survive closing the app' },
          { id: 4, title: 'Internet data', concept: 'Learn how to load data from an API', challenge: 'Fetch and display a list of items from a public API' },
        ]
      },
      {
        name: 'Build a real app',
        detail: 'A complete app from idea to finish',
        resources: ['Material Design', 'GitHub'],
        levels: [
          { id: 1, title: 'Plan the app', concept: 'Learn how to turn an idea into screens and features', challenge: 'Sketch the screens for a notes or habit tracker app' },
          { id: 2, title: 'Build the core feature', concept: 'Learn to build the main feature first', challenge: 'Make adding, editing and deleting items work' },
          { id: 3, title: 'Polish the design', concept: 'Learn Material Design themes and spacing', challenge: 'Add a color theme, icons, and a dark mode' },
          { id: 4, title: 'Test on a real phone', concept: 'Learn how to run your app on a device', challenge: 'Install your app on an Android phone and fix what feels wrong' },
        ]
      },
      {
        name: 'Publish on Google Play',
        detail: 'Portfolio + first users',
        resources: ['Google Play Console', 'GitHub'],
        levels: [
          { id: 1, title: 'Prepare a release', concept: 'Learn how release builds and signing work', challenge: 'Generate a signed release build of your app' },
          { id: 2, title: 'Store listing', concept: 'Learn what a store page needs', challenge: 'Write a description and take screenshots for your app' },
          { id: 3, title: 'Share your code', concept: 'Learn how to present a project on GitHub', challenge: 'Push your app to GitHub with a README and screenshots' },
        ]
      },
    ],
  },
  cybersecurity: {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    emoji: '🛡️',
    desc: 'Learn how systems are attacked so you can defend them. You start with Linux, networking and Python, then practice legally on labs and capture-the-flag challenges.',
    field: 'Cybersecurity',
    firstLanguage: 'Python + Linux',
    builds: ['Your own security tools and scripts', 'A home lab for safe, legal practice', 'Write-ups of solved capture-the-flag challenges'],
    careers: ['Security analyst (SOC)', 'Penetration tester', 'Security engineer'],
    steps: [
      {
        name: 'Linux & the command line',
        detail: 'Files, permissions, processes',
        resources: ['OverTheWire Bandit', 'Linux Journey'],
        levels: [
          { id: 1, title: 'The terminal', concept: 'Learn how to move around a system with commands', challenge: 'List, create, move and delete files using only the terminal' },
          { id: 2, title: 'Files & permissions', concept: 'Learn who can read, write and run a file', challenge: 'Make a file readable only by its owner' },
          { id: 3, title: 'Users & processes', concept: 'Learn how users and running programs work', challenge: 'Find a running process and stop it' },
          { id: 4, title: 'Searching & pipes', concept: 'Learn grep and how to chain commands', challenge: 'Find every line containing "error" in a log file and count them' },
          { id: 5, title: 'Bash scripts', concept: 'Learn how to save commands into a script', challenge: 'Write a script that backs up a folder' },
        ]
      },
      {
        name: 'Networking fundamentals',
        detail: 'IP, ports, DNS, HTTP',
        resources: ['Professor Messer', 'Cisco Networking Basics'],
        levels: [
          { id: 1, title: 'How the internet works', concept: 'Learn IP addresses, routers and packets', challenge: 'Find your own IP address and trace the route to a website' },
          { id: 2, title: 'Ports & protocols', concept: 'Learn what ports are and the common protocols', challenge: 'List which ports are used by HTTP, HTTPS, SSH and DNS' },
          { id: 3, title: 'DNS', concept: 'Learn how names turn into addresses', challenge: 'Look up the DNS records for a domain' },
          { id: 4, title: 'HTTP', concept: 'Learn requests, responses and status codes', challenge: 'Send an HTTP request from the terminal and read the headers' },
          { id: 5, title: 'Reading traffic', concept: 'Learn how to inspect packets with Wireshark', challenge: 'Capture your own traffic and find a DNS request in it' },
        ]
      },
      {
        name: 'Python for security',
        detail: 'Automate and build small tools',
        resources: ['Automate the Boring Stuff', 'Python docs'],
        levels: [
          { id: 1, title: 'Python basics', concept: 'Learn variables, loops and functions', challenge: 'Write a function that checks whether a password is at least 12 characters' },
          { id: 2, title: 'Files & text', concept: 'Learn how to read and search files', challenge: 'Read a log file and print every failed login line' },
          { id: 3, title: 'Hashing', concept: 'Learn what hashes are and why passwords are hashed', challenge: 'Compute the SHA-256 hash of a string' },
          { id: 4, title: 'Web requests', concept: 'Learn how to send HTTP requests from code', challenge: 'Fetch a web page and print its response headers' },
          { id: 5, title: 'Sockets', concept: 'Learn how programs talk over a network', challenge: 'Write a script that checks whether a port is open on your own machine' },
        ]
      },
      {
        name: 'Security foundations',
        detail: 'Common attacks and defenses',
        resources: ['TryHackMe', 'OWASP Top 10'],
        levels: [
          { id: 1, title: 'Thinking like an attacker', concept: 'Learn the CIA triad and how attacks are planned', challenge: 'List three ways a login page could be attacked and a defense for each' },
          { id: 2, title: 'Web vulnerabilities', concept: 'Learn SQL injection and XSS and how to prevent them', challenge: 'Explain why a given login query is vulnerable and rewrite it safely' },
          { id: 3, title: 'Passwords & authentication', concept: 'Learn how accounts are protected and broken', challenge: 'Explain why salting makes stolen password hashes harder to crack' },
          { id: 4, title: 'Encryption basics', concept: 'Learn symmetric and public-key encryption', challenge: 'Encrypt and decrypt a message with a key in Python' },
          { id: 5, title: 'Law & ethics', concept: 'Learn what you are allowed to test and why permission matters', challenge: 'Write the rules you would follow before testing any system' },
        ]
      },
      {
        name: 'Practice labs & CTFs',
        detail: 'Hands-on, legal practice',
        resources: ['TryHackMe', 'picoCTF', 'Hack The Box'],
        levels: [
          { id: 1, title: 'Set up a home lab', concept: 'Learn how to practice safely in virtual machines', challenge: 'Install a Linux virtual machine to use as your lab' },
          { id: 2, title: 'Your first CTF', concept: 'Learn how capture-the-flag challenges work', challenge: 'Solve three beginner challenges on picoCTF' },
          { id: 3, title: 'Write-ups', concept: 'Learn how to document what you found', challenge: 'Write a short report explaining how you solved one challenge' },
          { id: 4, title: 'Share your work', concept: 'Learn how to show your skills to employers', challenge: 'Publish your scripts and write-ups on GitHub' },
        ]
      },
    ],
  },
  cpp: {
    id: 'cpp',
    name: 'C++',
    emoji: '⚙️',
    desc: 'The language close to the machine: robots, electronics, game engines and anything that must be fast. Harder at first, but it teaches you how computers really work.',
    field: 'Systems & Embedded',
    firstLanguage: 'C++',
    builds: ['Arduino and robotics projects', 'Fast programs and simple game engines', 'Solutions to competitive programming problems'],
    careers: ['Embedded systems engineer', 'Systems programmer', 'Robotics or game-engine developer'],
    steps: [
      {
        name: 'C++ basics',
        detail: 'Variables, loops, functions',
        resources: ['learncpp.com', 'cppreference'],
        levels: [
          { id: 1, title: 'Your first program', concept: 'Learn how a C++ program is written, compiled and run', challenge: 'Print your name to the screen' },
          { id: 2, title: 'Variables & types', concept: 'Learn int, double, char, bool and string', challenge: 'Store your age and height and print them in a sentence' },
          { id: 3, title: 'Conditions', concept: 'Learn if and else', challenge: 'Read a number and print whether it is positive, negative or zero' },
          { id: 4, title: 'Loops', concept: 'Learn for and while loops', challenge: 'Print the multiplication table of 7' },
          { id: 5, title: 'Functions', concept: 'Learn how to write and call functions', challenge: 'Write a function that returns the largest of three numbers' },
          { id: 6, title: 'Arrays & vectors', concept: 'Learn how to store many values', challenge: 'Read five numbers into a vector and print their average' },
        ]
      },
      {
        name: 'Memory & pointers',
        detail: 'How the computer stores data',
        resources: ['learncpp.com', 'The Cherno'],
        levels: [
          { id: 1, title: 'Memory', concept: 'Learn how variables live in memory', challenge: 'Print the memory address of a variable' },
          { id: 2, title: 'Pointers', concept: 'Learn what a pointer is and how to use one', challenge: 'Change the value of a variable through a pointer' },
          { id: 3, title: 'References', concept: 'Learn references and passing by reference', challenge: 'Write a function that swaps two numbers' },
          { id: 4, title: 'Stack & heap', concept: 'Learn new, delete and smart pointers', challenge: 'Create an object with a smart pointer and explain when it is freed' },
        ]
      },
      {
        name: 'Object-oriented C++',
        detail: 'Classes and the standard library',
        resources: ['learncpp.com', 'cppreference'],
        levels: [
          { id: 1, title: 'Classes', concept: 'Learn how to group data and functions', challenge: 'Create a BankAccount class with deposit and withdraw' },
          { id: 2, title: 'Constructors', concept: 'Learn how objects are created and cleaned up', challenge: 'Add a constructor that sets the starting balance' },
          { id: 3, title: 'Inheritance', concept: 'Learn how classes build on other classes', challenge: 'Create a Shape class with Circle and Square subclasses' },
          { id: 4, title: 'The standard library', concept: 'Learn vector, map and algorithms', challenge: 'Count how many times each word appears in a sentence' },
        ]
      },
      {
        name: 'Problem solving & algorithms',
        detail: 'Think like a programmer',
        resources: ['Codeforces', 'CSES Problem Set'],
        levels: [
          { id: 1, title: 'Searching', concept: 'Learn linear and binary search', challenge: 'Implement binary search on a sorted vector' },
          { id: 2, title: 'Sorting', concept: 'Learn how sorting works and how to use std::sort', challenge: 'Sort a list of students by grade' },
          { id: 3, title: 'Big-O', concept: 'Learn how to measure how fast code is', challenge: 'Explain why binary search is faster than checking every item' },
          { id: 4, title: 'Recursion', concept: 'Learn functions that call themselves', challenge: 'Write a recursive function for factorial' },
          { id: 5, title: 'Practice problems', concept: 'Learn how to approach a new problem', challenge: 'Solve three beginner problems on Codeforces' },
        ]
      },
      {
        name: 'Build a hardware or systems project',
        detail: 'Arduino, a small game, or a tool',
        resources: ['Arduino docs', 'GitHub'],
        levels: [
          { id: 1, title: 'Pick a project', concept: 'Learn how to scope a first project', challenge: 'Choose between an Arduino gadget, a terminal game, or a command-line tool' },
          { id: 2, title: 'Build the core', concept: 'Learn to get the simplest version working first', challenge: 'Make the smallest working version of your project' },
          { id: 3, title: 'Organize your code', concept: 'Learn header files and splitting code into files', challenge: 'Split your project into at least two source files' },
          { id: 4, title: 'Share on GitHub', concept: 'Learn how to present a project', challenge: 'Push your project with a README explaining how to build it' },
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

const legacyKeys: Record<string, string> = {
  JavaScript: 'javascript',
  Python: 'python',
  Swift: 'swift',
  'C#': 'csharp',
}

// Accounts created before fields existed stored the language name ("JavaScript");
// newer ones store the path id ("cybersecurity").
export function resolvePath(stored: string): Language {
  return languages[legacyKeys[stored] ?? stored] ?? languages.javascript
}
