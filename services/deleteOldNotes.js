const { Note } = require('../models')

const deleteOldNotes = async () => {
    const now = new Date();
    const fifteenDaysAgo = new Date(now.setDate(now.getDate() - 15));

    try {
        const result = await Note.destroy({
            where: {
                is_deleted: true,
                deleted_at: { [Sequelize.Op.lte]: fifteenDaysAgo },
            },
        });
        console.log(`${result} old notes permanently deleted.`);
    } catch (error) {
        console.error("Error deleting old notes:", error);
    }
};

module.exports = deleteOldNotes