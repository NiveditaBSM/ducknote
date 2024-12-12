const { Note } = require('../models')
const sanitizeHtml = require('sanitize-html');

exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.findAll({ where: { user_id: req.user.user_id, is_deleted: false } });
        return res.status(200).json({ success: true, notes })
    } catch (error) {
        console.error('Error fetching the notes: ', error)
        return res.status(500).json({ success: false, internalError: 'An error occured while fetching notes' })
    }
};

exports.addNote = async (req, res) => {
    const { title, content } = req.body;
    const user_id = req.user.user_id;

    if (!title || !content) {
        return res.status(400).json({ success: false, error: 'Title and content are required.' });
    }

    try {
        const sanitizedContent = sanitizeHtml(content, {
            allowedTags: [],
            allowedAttributes: {}
        });

        const note = await Note.create({
            user_id,
            title,
            content: sanitizedContent,
        })
        return res.status(200).json({ success: true, note });

    } catch (error) {
        console.error('Error while adding note: ', error)
        return res.status(500).json({ success: false, internalError: 'An error occurred while creating the note' })
    }
}

exports.updateNote = async (req, res) => {
    const { note_id } = req.params
    const { title, content } = req.body;
    const user_id = req.user.user_id

    if (!title && !content) {
        return res.status(400).json({ success: false, error: 'At least one field (title or content) must be provided to update.' });
    }

    try {
        const sanitizedContent = content && sanitizeHtml(content, {
            allowedTags: [],
            allowedAttributes: {}
        });

        const note = await Note.findOne({ where: { note_id, user_id, is_deleted: false } })
        if (!note) {
            return res.status(404).json({ success: false, error: 'Note not found or does not belong to the user.' })
        }

        const [rowsUpdated, updatedNotes] = await Note.update(
            {
                title: title || note.title,
                content: sanitizedContent || note.content,
                updated_at: new Date()
            },
            { where: { note_id, user_id }, returning: true }
        );

        if (rowsUpdated === 0) {
            return res.status(500).json({
                success: false,
                error: 'Failed to update the note due to unknown reasons.',
            });
        }

        return res.status(200).json({
            success: true,
            updatedNote: updatedNotes[0],
        });

    } catch (error) {

        console.error('Error while updating note: ', error)
        return res.status(500).json({ success: false, internalError: 'An error occurred while updating note' })
    }
}

exports.deleteNote = async (req, res) => {
    const { note_id } = req.params;
    const user_id = req.user.user_id;

    try {

        const note = await Note.findOne({ where: { note_id, user_id, is_deleted: false } });

        if (!note) {
            return res.status(404).json({ success: false, error: 'Note not found or or does not belong to the user.' });
        }

        await Note.update(
            {
                is_deleted: true,
                deleted_at: new Date() //Sequelize.fn('now') 
            },
            { where: { note_id, user_id } }
        );

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error while deleting note:', error);
        return res.status(500).json({ success: false, internalError: 'An error occurred while deleting the note.' });
    }
}