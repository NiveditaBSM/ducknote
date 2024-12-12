const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define the Tags model
const Tag = sequelize.define('Tag', {
    tag_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id',
        },
        onDelete: 'CASCADE',
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
}, {

    tableName: 'tags',
    timestamps: false,
});

module.exports = Tag;
