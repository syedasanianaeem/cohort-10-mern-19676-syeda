const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
    // Find user by email
    findByEmail: async (email) => {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    // Create a new user
    create: async (username, email, hashedPassword) => {
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
        return result.insertId;
    }
};

module.exports = User;