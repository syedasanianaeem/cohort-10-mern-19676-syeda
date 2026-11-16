const Note = require('../models/noteModel');
const logger = require('../utils/logger');

// Fetch all notes for logged-in user
const getNotes = async (req, res, next) => {
    try {
        const notes = await Note.getAllByUserId(req.user.id);
        res.status(200).json({ success: true, notes });
    } catch (error) {
        logger.error(`Error fetching notes: ${error.message}`);
        next(error);
    }
};

// Create a new note
const createNote = async (req, res, next) => {
    try {
        const { title, content } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: 'Note title is required' });
        }

        const noteId = await Note.create(req.user.id, title, content || '');
        logger.info(`Note created (ID: ${noteId}) by User ID: ${req.user.id}`);
        
        res.status(201).json({
            success: true,
            message: 'Note created successfully',
            note: { id: noteId, user_id: req.user.id, title, content: content || '' }
        });
    } catch (error) {
        logger.error(`Error creating note: ${error.message}`);
        next(error);
    }
};

// Update a note
const updateNote = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: 'Note title is required' });
        }

        const affectedRows = await Note.update(id, req.user.id, title, content || '');
        if (affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Note not found or unauthorized' });
        }

        logger.info(`Note updated (ID: ${id}) by User ID: ${req.user.id}`);
        res.status(200).json({ success: true, message: 'Note updated successfully' });
    } catch (error) {
        logger.error(`Error updating note: ${error.message}`);
        next(error);
    }
};

// Delete a note
const deleteNote = async (req, res, next) => {
    try {
        const { id } = req.params;

        const affectedRows = await Note.delete(id, req.user.id);
        if (affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Note not found or unauthorized' });
        }

        logger.info(`Note deleted (ID: ${id}) by User ID: ${req.user.id}`);
        res.status(200).json({ success: true, message: 'Note deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting note: ${error.message}`);
        next(error);
    }
};

module.exports = { getNotes, createNote, updateNote, deleteNote };