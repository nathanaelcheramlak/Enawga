import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';

import messageRoutes from './routes/message.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import searchRoutes from './routes/search.routes.js';

import connectToMongoDB from './db/connectToMongoDB.js';
import logServerRequests from './middleware/logServerRequests.js';
import passport from './middleware/passportMiddleware.js';
import { server, app } from './utils/socket.js'

// const app = express();
const PORT = process.env.PORT || 5000;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;

dotenv.config();
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Allow requests only from this origin
  credentials: true, // Enable cookies to be included in requests
  exposedHeaders: ['set-cookie'],
};

// Middleware to log every request with status code and duration
app.use(logServerRequests);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // parse cookies attached to the client request
app.use(cors(corsOptions));

app.use(
  session({
    secret: GOOGLE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  }),
);

// Setting up passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`The server is running on port ${PORT}`);
});

export default app;
