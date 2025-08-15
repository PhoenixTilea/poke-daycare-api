- [Scope](#scope)
- [Installation and Commands](#installation-and-commands)
- [Usage](#usage)
- [Original Prompt](#original-prompt)

# Pokemon Daycare API

A Node.js API which uses the public PokeAPI to simulate a daycare where trainers can sign up, register their Pokemon for care, and check their Pokemon's status. They might even get an egg out of it!

## Scope

For the sake of my time and sanity, I made a few decisions to limit the scope of the project. Maybe one day for funzies I'll flesh this out into a fully-functional daycare system API backend.

- I had to pick a game version when it came to Pokemon moves for the sake of consistency. I decided to go with my favorite version, which is Pokemon Crystal. Therefore, only Pokemon 1 through 251 (Generations I and II) are currently supported.
- There's nothing involving held items.
- In-game, two Pokemon have a chance to produce an egg every 256 steps the trainer takes. For now, this app just rolls that die once when a Pokemon is "picked up".
- When a Pokemon is registered, it only asks for their level. thus, their experience is automatically set to the minimum EXP they would need for that level.
- There's no actual information about the egg if one generates; it's just a boolean.

## Installation and Commands

### Prerequisites

- Node.js - Preferrably 22.x or later
- NPM
- A REST API client like Postman, Insomnia, or Yaak

### Install Dependencies

After cloning the repo, go to the folder in your command line and run:

```
npm i
```

Or

```
yarn
```

### Run the App

To start the server on your local environment, run:

```
npm start
```

Or

```
yarn start
```

This will launch the app at (http://localhost:3000). You can change the port if you'd like by setting the `PORT` environment variable.

See the Usage section below for a step-by-step guide on using your REST client to test the app.

### Unit tests

To run the unit tests:

```
npm test
```

Or

```
yarn test
```

## Usage

This app has a few endpoints to simulate the basic functions of signing up, registering up to 2 Pokemon with the daycare, checking their status, logging steps, and finally picking up a Pokemon.

### Step 1: Look Up a Pokemon

To correctly register a Pokemon, you'll need to know a few details about its "species". Use the following endpoint to get info about a specific Pokemon based on its number or name:

#### GET /api/pokemon/{idOrName}

**Requires Auth:** No

**Request Parameters:**

- idOrName (string | number) - This is either the Pokemon's name or its National Dex number. As mentioned in the Scope section, I've limited this to the first 251 Pokemon (Generations I and II).

**Response:**

```
{
  "id": "number", // Pokemon's National Dex number
  "name": "string", // The Pokemon species name
  "canBeFemale": "bool", // Whether or not this Pokemon can have the female gender
  "canBeMale": "bool", // Whether or not this pokemon can have the male gender
  "isGenderless": "bool", // Whether this Pokemon has no gender
  "canBreed": "bool", // Whether or not this Pokemon could potentially produce an egg with another Pokemon
  "eggGroups": "string[]", // The egg grups to which this Pokemon belongs
  "possibleMoves": [{ // Information about the moves this Pokemon could know / learn
    "name": "string", // The name of the move
    "learnedAtLevel": "number" // At which level this Pokemon learns this move, or 0 if it isn't learned by leveling up
  }]
}
```

### Step 2: Register as a Trainer

All other interactions in this API require authentication, so you'll need to sign up with a username and password.

#### POST /api/trainer/register

**Requires Auth:** No

**Request Body:**

```
{
  "username": "string", // Must be 8 - 20 characters with only letters, numbers, or underscores (_)
  "password": "string" // Must be 8 - 20 characters long and contain only letters, numbers, and the characters _, @, $, %, or !
}
```

**Response:** A flavor message indicating success.

### Step 3: Authenticate

For the remaining endpoints, you'll need to pass the Authorization request header using a BASIC auth token. Set this up in your REST client before continuing.

### Step 4: Register a Pokemon

A trainer (user) can register up to 2 Pokemon in the daycare at once. Use the following endpoint to add 1 or 2 Pokemon.

#### POST /api/trainer/pokemon/register

**Requires Auth:** Yes

**Request Body:**

```
{
  "speciesId": "number|string", // A number between 1 and 251 or a valid Pokemon name from Generations I or II
  "nickname"?: "string", // Optional - a nickname for your Pokemon
  "isFemale"?: "bool", // Whether your Pokemon is female. You'll get an error if the Pokemon can't be female.
  "level": "number", // Your Pokemon's current level - a number between 1 and 100
  "moves": "string[]" // 1 to 4 move names your Pokemon currently knows. These names must be in and match the list of possible moves returned by the first endpoint
}
```

**Response:**

```
{
  "registrationId": "number", // The Pokemon's unique ID in the system. You'll need this to check on it / pick it up
  "message": "string" // Just a flavor message
}
```

### Step 5: Log Steps

Pokemon in the daycare level up as a trainer takes steps. This endpoint adds experience to each of your registered Pokemon equivalent to the steps parameter.

#### POST /api/trainer/steps/{stepCount}

**Requires Auth:** Yes

**Request Parameters**

- stepCount - A number representing the steps the trainer has taken.

**Request Body:** None

**Response:** Just some flavor text on success.

### Step 6 (Optional): Check Your Pokemon

To get the names and registration IDs of your currently registered Pokemon, use this endpoint.

#### GET /api/trainer/pokemon

**Requires Auth:** Yes

**Response:**

```
[{
  "registrationId": "number", // The Pokemon's unique ID in the system
  "name": "string" // The Pokemon's species name or its nickname if it has one
}]
```

To get the details of a single Pokemon, you need its registrationId.

#### GET /api/trainer/pokemon/{registrationId}

**Requires Auth:** Yes

**Request Parameters:**

- registrationId (number) = The Pokemon's unique registration ID returned when it was registered.

**Response:**

```
{
  "registrationId": "number", // The Pokemon's unique ID in the system
  "name": "string", // The pokemon's nickname or species name
  "currentLevel": "number", // The Pokemon's current level, taking into account the steps the trainer has logged
  "levelsGained": "number" // How many levels total the Pokemon has gained while registered
}
```

### Step 7: Finally, Pick Up A Pokemon

To take your Pokemon out of the daycare and see its progress, call this endpoint.

#### DELETE /api/trainer/pokemon/pickup/{registrationId}

**Requires Auth:** Yes

**Request Parameters:**

- registrationId (number) = The Pokemon's unique ID in the system, returned when you registered it

**Request Body:** None

**Response:**

```
{
  "message": "string", // A message indicating how many levels your Pokemon gained, whether it learned any new moves, and whether you're also receiving a Pokemon egg
  "pokemon": { // The Pokemon you're picking up
    "name": "string", // The pokemon's nickname or species name
    "species": "string", // The Pokemon's species name - in case it has a nickname
    "level": "number", // The Pokemon's new level
    "moves": "string[]" // The Pokemon's move list, possibly different from when it was registered
  }
}
```

## Tech Used

- Node.js / express / TypeScript
- SqLite with typeORM for in-app database
- axios for external requests (probably could've used native fetch, but the instructions specifically mentioned axios)
- inversifyJs for Dependency Injection / Inversion of Control
- bcrypt for password hashing
- Node-cache for basic in-memory caching
- tsx to run the app without TypeScript compilation
- Jest for unit testing
- eslint / prettier for linting and code formatting
- Husky / lint-stage to lint / format on a pre-commit hook

## Original Prompt

### 🔪 Technical Test: PokeAPI Extension (Node.js + Express + TypeScript)

Welcome to the technical assessment! This test is designed to evaluate your backend development skills, including API design, external API integration, TypeScript usage, and code quality. You'll be building an API that interacts with the public PokeAPI and extends it with your own functionality.

### 📋 Objective

Create an Express-based Node.js API application (written in TypeScript) that fetches data from the public PokeAPI and extends it with additional logic, data aggregation, or derived features.

This is a backend-only challenge – no frontend is required.

### 🧠 Requirements

Your API must:

1. Be built with Node.js, Express, and TypeScript.
2. Interact with the PokeAPI using axios or another HTTP client.
3. Interact with a local database (In memory or instance) which holds your custom models, which can be linked wtih PokeAPI data. Example:

- Trainer/ NPC information
- Manage a team of Pokémon
- Assign Gym badges
- Gym's. Which can contain NPC's with certain Pokémon.

4. The Trainer interactions should be done via Authenticated routes.

- No need for anything complex but a simple Username, password authentication. Returning a token or JWT.
- Some of the routes should be locked down correctly behind authentication checks, for example:
  - A trainer should be able to see their team information only.

5. Include input validation and error handling.
   6.Be well-structured and easy to read and extend.
6. Include basic unit tests for key services or logic.
7. Include a README.md (this file) with instructions.

### 🧪 Testing

You should include a few basic tests using any test framework (jest preferred).

### 🛠 Tech Stack

- Node.js
- Express
- TypeScript
- MySQL (optional, can use an in memory cache or another DB Engine)
- Axios
- Jest (or another testing library)

Optional (for bonus points):

- Use a simple dependency injection pattern or structure.
- Use a caching mechanism like node-cache or redis.
- Add OpenAPI (Swagger) documentation.
- Password checks done with Bcrypt using Hashed values
- ESLint + Prettier
- Husky for pre-commit hooks
- GitHub actions for validating code when raising a pull request (ESLint + Prettier)

### 🫼 Code Quality

We expect clean, modular code with proper use of TypeScript types and interfaces. Favor readability and maintainability over premature optimization. The data structure is completely up to you, they can be as basic as needed or include extra information if you'd like but there should be no pressure to build out too many data points.

### ✅ Submission

Please provide:

1. A link to your GitHub/GitLab repo (public or private with access granted).
2. Instructions on how to run and test the application (if not covered in this README).

### 🙌 Good Luck!

This challenge is meant to highlight your strengths – show off your clean code, design patterns, and backend skills. We’re not looking for pixel-perfect results, but a clear demonstration of your technical ability and thought process.
Happy coding!
