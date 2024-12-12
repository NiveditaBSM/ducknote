const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define the sharing model
const Sharing = sequelize.define('Sharing', {
    share_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    note_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'notes',
            key: 'note_id',
        },
        onDelete: 'CASCADE',
    },
    shared_with: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id',
        },
        onDelete: 'CASCADE',
    },
    can_edit: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'sharing',
    timestamps: false,
});

module.exports = Sharing;
