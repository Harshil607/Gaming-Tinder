# Gaming Tinder

Gaming Tinder is a full-stack web app that turns game discovery into a swipe-based experience. Users can sign up, browse a catalog of games, like or dislike titles, and receive personalized recommendations based on the genres they prefer.

## Features

- User registration and login with JWT-based authentication
- Protected routes for authenticated users only
- Swipe-based game browsing experience
- Personalized game recommendations driven by liked/disliked genres
- MongoDB-backed persistence for users, swipes, and game catalog data
- IGDB-powered game data seeding for a large game library

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: JWT + bcrypt
- Game data: IGDB API

## Project Structure

```text
.
├── backend/
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── services/
│   └── server.js
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── .env
├── package.json
├── package-lock.json
└── README.md
```

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string
- An IGDB account with a client ID and client secret

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/gaming-tinder
JWT_SECRET=your_super_secret_key
IGDB_CLIENT_ID=your_igdb_client_id
IGDB_CLIENT_SECRET=your_igdb_client_secret
```

## Installation

Install the backend dependencies:

```bash
npm install
```

Install the frontend dependencies:

```bash
cd frontend
npm install
```

## Running the App

Start the backend server from the project root:

```bash
npm run dev
```

Start the frontend development server in a separate terminal:

```bash
cd frontend
npm run dev
```

The frontend is typically served at `http://localhost:5173`, while the backend runs on `http://localhost:5000` by default.

## Seeding the Game Database

To populate MongoDB with games from the IGDB API, run:

```bash
node backend/scripts/seedGames.script.js
```

This fetches the game catalog and stores it in the `Game` collection.

## Authentication and API Overview

### Register a user

```http
POST /api/auth/register
```

Request body:

```json
{
  "username": "gamer123",
  "email": "gamer@example.com",
  "password": "password123"
}
```

### Login

```http
POST /api/auth/login
```

Request body:

```json
{
  "email": "gamer@example.com",
  "password": "password123"
}
```

Response includes a JWT token that must be sent in the `Authorization` header for protected routes:

```http
Authorization: Bearer <token>
```

### Get games

```http
GET /api/games
```

### Swipe on a game

```http
POST /api/swipes
```

Request body:

```json
{
  "gameId": 12345,
  "action": "like"
}
```

Valid actions are:

- `like`
- `dislike`

### Get swipes

```http
GET /api/swipes
```

### Get recommendations

```http
GET /api/recommendations
```

This endpoint analyzes the user's liked and disliked game genres and returns a ranked list of unseen games that match their tastes.

## How It Works

1. A user creates an account and logs in.
2. The frontend fetches the game catalog from the backend.
3. The user swipes through games with a like or dislike action.
4. The backend stores each swipe and evaluates genre preferences.
5. The app recommends games that align with the user's positive genre trends.

## Notes

- This project is currently built as a demo/learning project and is intended for local development.
- For production use, consider adding stronger validation, rate limiting, password reset flows, and deployment configuration.

## License

This project is licensed under the ISC license.
