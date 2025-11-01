import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import School from '../models/School.js';
import UserSession from '../models/UserSession.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('username').trim().isLength({ min: 3, max: 30 }),
  body('password').isLength({ min: 6 }),
  body('mssv').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, username, password, mssv } = req.body;

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email: normalizedEmail }, { username: username.trim() }] 
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create user (no school validation required)
    const user = new User({
      email: normalizedEmail,
      username: username.trim(),
      password_hash,
      mssv: mssv?.trim() || undefined,
      school_id: null, // Optional, can be set later
      is_verified: false
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Save session
    const session = new UserSession({
      user_id: user._id,
      token,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    await session.save();

    res.status(201).json({
      message: 'User created successfully. Please verify your email.',
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        mssv: user.mssv,
        avatar_url: user.avatar_url,
        is_verified: user.is_verified
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();
    console.log('🔍 Login attempt:', { email: normalizedEmail, passwordLength: password.length });
    
    // Try to find user with normalized email
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      // Try case-insensitive search as fallback
      const userCaseInsensitive = await User.findOne({ 
        email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } 
      });
      
      if (userCaseInsensitive) {
        console.log('⚠️ Found user with different case, updating email to normalized version');
        userCaseInsensitive.email = normalizedEmail;
        await userCaseInsensitive.save();
        const isValid = await bcrypt.compare(password, userCaseInsensitive.password_hash);
        if (isValid) {
          // Continue with login flow...
          userCaseInsensitive.last_seen = new Date();
          await userCaseInsensitive.save();
          const token = jwt.sign(
            { userId: userCaseInsensitive._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
          );
          const session = new UserSession({
            user_id: userCaseInsensitive._id,
            token,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          });
          await session.save();
          return res.json({
            token,
            user: {
              _id: userCaseInsensitive._id,
              email: userCaseInsensitive.email,
              username: userCaseInsensitive.username,
              mssv: userCaseInsensitive.mssv,
              avatar_url: userCaseInsensitive.avatar_url,
              bio: userCaseInsensitive.bio,
              role: userCaseInsensitive.role,
              is_verified: userCaseInsensitive.is_verified,
              preferences: userCaseInsensitive.preferences
            }
          });
        }
      }
      console.log('❌ User not found:', normalizedEmail);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('✅ User found:', { userId: user._id, email: user.email, hasPasswordHash: !!user.password_hash });

    if (!user.password_hash) {
      console.log('❌ User has no password_hash');
      return res.status(401).json({ error: 'Please use OAuth login' });
    }

    console.log('🔐 Comparing password...');
    const isValid = await bcrypt.compare(password, user.password_hash);
    console.log('🔐 Password match:', isValid);
    
    if (!isValid) {
      console.log('❌ Password mismatch');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last seen
    user.last_seen = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Save session
    const session = new UserSession({
      user_id: user._id,
      token,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    await session.save();

    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        mssv: user.mssv,
        avatar_url: user.avatar_url,
        bio: user.bio,
        role: user.role,
        is_verified: user.is_verified,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify email
router.post('/verify-email', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // In production, send verification email with token
    // For now, just mark as verified
    user.is_verified = true;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password_hash')
      .populate('school_id', 'name domain');
    
    res.json({ user });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout
router.post('/logout', authenticate, async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      await UserSession.deleteOne({ token });
    }

    // Update user offline status
    const user = await User.findById(req.user._id);
    if (user) {
      user.is_online = false;
      user.last_seen = new Date();
      await user.save();
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

