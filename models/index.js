require('dotenv').config({ path: '../.env' })
const sequelize = require('../config/database');

const User = require('./user');
const Note = require('./note');
const Notebook = require('./notebook');
const Tag = require('./tag');
const NoteTag = require('./noteTag');
const Sharing = require('./sharing');

User.hasMany(Note, { foreignKey: 'user_id' });
Note.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Notebook, { foreignKey: 'user_id' });
Notebook.belongsTo(User, { foreignKey: 'user_id' });

Note.belongsToMany(Tag, { through: NoteTag, foreignKey: 'note_id' });
Tag.belongsToMany(Note, { through: NoteTag, foreignKey: 'tag_id' });

Note.hasMany(Sharing, { foreignKey: 'note_id' });
User.hasMany(Sharing, { foreignKey: 'shared_with' });
Sharing.belongsTo(Note, { foreignKey: 'note_id' });
Sharing.belongsTo(User, { foreignKey: 'shared_with' });

const syncModels = async () => {
    try {
        await sequelize.authenticate()
        console.log('Authentication successful!')
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully!');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
};

syncModels();

module.exports = {
    User,
    Note,
    Notebook,
    Tag,
    NoteTag,
    Sharing,
    sequelize,
    syncModels,
};
