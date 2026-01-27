import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const protectRoute = async (req, res, next) => {
  try {
    // Get token from either cookies (legacy) or Authorization header (Bearer token)
    let token = req.cookies.jwt;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
      }
    }

    if (!token) {
      return res
        .status(401)
        .json({ error: 'Unauthorized - No Token Provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized - Invalid Token' });
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found (Middleware)' });
    }

    req.user = user; // Adds the user to the request

    next(); // Finishes and calls the next callback function
  } catch (error) {
    console.error('Error in protectRoute middleware: ', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default protectRoute;
