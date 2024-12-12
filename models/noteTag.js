const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define the note_tags model (association table)
const NoteTag = sequelize.define('NoteTag', {
    note_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'notes',
            key: 'note_id',
        },
        onDelete: 'CASCADE',
    },
    tag_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'tags',
            key: 'tag_id',
        },
        onDelete: 'CASCADE',
    }
}, {
    tableName: 'note_tags',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['note_id', 'tag_id'],
        },
    ],
});

module.exports = NoteTag;
