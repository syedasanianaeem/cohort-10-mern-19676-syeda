const db = require('../config/db');

const Note = {
    // Get all notes for a specific user
    getAllByUserId: async (userId) => {
        const [rows] = await db.execute(
            'SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        return rows;
    },

    // Create a new note
    create: async (userId, title, content) => {
        const [result] = await db.execute(
            'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)',
            [userId, title, content]
        );
        return result.insertId;
    },

    // Update an existing note
    update: async (noteId, userId, title, content) => {
        const [result] = await db.execute(
            'UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?',
            [title, content, noteId, userId]
        );
        return result.affectedRows;
    },

    // Delete a note
    delete: async (noteId, userId) => {
        const [result] = await db.execute(
            'DELETE FROM notes WHERE id = ? AND user_id = ?',
            [noteId, userId]
        );
        return result.affectedRows;
    }
};

module.exports = Note;