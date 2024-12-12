const cron = require('node-cron')
const deleteOldNotes = require('../services/deleteOldNotes')

const scheduleDeleteOldNotes = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log("Running scheduled job: deleteOldNotes...")
        deleteOldNotes()
    })
}

module.exports = scheduleDeleteOldNotes
