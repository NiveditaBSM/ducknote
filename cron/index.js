const scheduleDeleteOldNotes = require('./deleteOldNotes')

const startCronJobs = () => {
    console.log('Cron jobs being initialized...')
    scheduleDeleteOldNotes()
    //other cron jobs could be added here
}

module.exports = startCronJobs