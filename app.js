require('dotenv').config();
const express = require('express');
const userRouter = require('./routes/userRouter')
const noteRouter = require('./routes/noteRouter')
const startCronJobs = require('./cron')

const app = express();
app.use(express.json());

startCronJobs()
app.get('/', (request, response) => {
    response.send('Ducknote API is up and running!');
});

app.use('/users', userRouter)
app.use('/notes', noteRouter)


const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server is running on the port ${PORT}`)
})

