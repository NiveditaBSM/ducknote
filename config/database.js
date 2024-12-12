const { Sequelize } = require('sequelize');

// console.log({
//     DB_NAME: process.env.DB_NAME,
//     DB_USER: process.env.DB_USER,
//     DB_PASSWORD: process.env.DB_PASSWORD,
//     DB_HOST: process.env.DB_HOST,
//     DB_PORT: process.env.DB_PORT,
// });

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: false,
        }
    }
)

module.exports = sequelize;