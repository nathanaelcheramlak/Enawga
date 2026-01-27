import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/generateToken.js';
import { v4 as uuid4 } from 'uuid';

export const signUp = async (req, res) => {
  try {
    const { fullName, username, email, password, confirmPassword } = req.body;

    if (!fullName || !username || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 8 characters long' });
    }

    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
      profilePic: '',
      bio: '',
    });

    await newUser.save();

    generateTokenAndSetCookie(newUser._id, res, '1h');

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.error('Error signing up controller:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const email = req.user?._json?.email;
    const rememberMe = req.query.rememberMe === 'true';

    if (!email) {
      return res
        .status(400)
        .json({ error: 'No email found in Google profile' });
    }

    // create the user pr
    let user = await User.findOne({ email });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(uuid4(), salt);
      const username = `${req.user?.displayName
        .replace(' ', '_')
        .toLowerCase()}${Math.floor(10 + Math.random() * 90)}`;

      user = await User.create({
        fullName: req.user?.displayName,
        username,
        email,
        password: hashedPassword,
        profilePic: req.user._json?.picture,
        bio: '',
      });
    }

    const tokenExpiration = '4h';
    generateTokenAndSetCookie(user._id, res, tokenExpiration);

    // res.status(200).json({
    //   _id: user._id,
    //   fullName: user.fullName,
    //   username: user.username,
    //   email: user.email,
    //   profilePic: user.profilePic,
    //   bio: user.bio,
    // });
    res.redirect('http://localhost:3000/home');
  } catch (error) {
    console.error('Error in google login controller:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const rememberMe = req.query.rememberMe === 'true';

    const user = await User.findOne({ username });
    const isPasswordCorrect =
      user && (await bcrypt.compare(password, user.password));

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const tokenExpiration = rememberMe ? '7d' : '1h';
    generateTokenAndSetCookie(user._id, res, tokenExpiration);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      bio: user.bio,
    });
  } catch (error) {
    console.error('Error in login controller:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie('jwt', '', {
      maxAge: 0,
      sameSite: 'lax',
      httpOnly: true,
    });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error Logout controller:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const token = req.cookies['jwt'];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select(
      '_id fullName username email profilePic bio',
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error in token verification:', error.message);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};
