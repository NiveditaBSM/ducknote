const express = require('express');
const noteRouter = express.Router();
const authenticateToken = require('../middleware/authenticate')
const noteController = require('../controllers/noteController')

noteRouter.get('/', authenticateToken, noteController.getNotes);

noteRouter.post('/', authenticateToken, noteController.addNote)

noteRouter.put('/:note_id', authenticateToken, noteController.updateNote)

noteRouter.delete('/:note_id', authenticateToken, noteController.deleteNote)

module.exports = noteRouter;