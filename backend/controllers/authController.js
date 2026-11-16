const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Signup Controller
const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email is already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user to database
        const userId = await User.create(username, email, hashedPassword);
        
        logger.info(`New user registered successfully with ID: ${userId}`);
        res.status(201).json({ success: true, message: 'User registered successfully', userId });
    } catch (error) {
        logger.error(`Signup error: ${error.message}`);
        next(error);
    }
};

// Login Controller
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        // Check if user exists
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        // Generate JWT Token (expires in 1 day)
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret_key_notes_app', {
            expiresIn: '1d'
        });

        logger.info(`User logged in successfully: ${email}`);
        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token,
            user: { id: user.id, username: user.username, email: user.email }
        });
    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        next(error);
    }
};

module.exports = { signup, login };