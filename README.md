# Enawga

A real-time chat application built using Node.js, React, and WebSocket, where users can join different rooms and communicate instantly.

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Authors](#authors)

## Description

This project is a real-time chat application designed to enable users to join various chat rooms, exchange messages, and share their profiles with others. The app leverages WebSocket for instant messaging, providing users with a fast and engaging experience.

## Features

- **Real-Time Messaging:** Allows users to chat in real time within multiple rooms.
- **User Authentication:** Google OAuth2.0 authentication.
- **User Profiles:** Users can upload profile pictures and add a bio.
- **Responsive Design:** The UI is optimized for both desktop and mobile devices.

## Tech Stack

### Frameworks and Libraries

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/en/starter/installing.html)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://docs.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/docs/v4/index.html)
[![Google OAuth](https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/identity/protocols/oauth2)
[![WebSocket](https://img.shields.io/badge/WebSocket-00C300?style=for-the-badge&logo=socketdotio&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

## Environment Variables

### Backend Setup

Create a `.env` file in the `backend/` directory for local development:

```env
PORT=5000
MONGODB_URI=<your_mongodb_cluster_uri>
JWT_SECRET=<your_jwt_secret>
NODE_ENV=development
CLIENT_ID=<your_google_client_id>
GOOGLE_SECRET=<your_google_secret>
FRONTEND_URL=http://localhost:3000
```

For production on Render, set the `FRONTEND_URL` environment variable in your Render dashboard:

```env
FRONTEND_URL=https://enawga.vercel.app
```

### Frontend Setup

Create a `.env.local` file in the `front-end/` directory for local development:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

For production on Vercel, update `.env.production` in `front-end/` with your Render backend URL:

```env
NEXT_PUBLIC_API_URL=https://enawga-backend.onrender.com
```

# Installation

To set up and run the project locally, follow these steps:

### Backend Setup

- **Open Terminal 1** and run the following commands:

```bash
npm install        # Install backend dependencies
npm run server     # Start the backend server
```

### Frontend Setup

- **Open Terminal 2** and run the following commands:

```bash
cd front-end       # Navigate to the frontend directory
npm install        # Install frontend dependencies
npm run build      # Build the frontend
npm run start      # Start the frontend server
```

The backend server will run on port 5000 by default, and the frontend server should run on the specified port in your configuration.

# Authors

- [Yeabsira Moges](https://github.com/coleYab)
- [Nathanael Cheramlak](https://github.com/nathanaelcheramlak)
- [Daniel Yohannes](https://github.com/DanielJohn17)
