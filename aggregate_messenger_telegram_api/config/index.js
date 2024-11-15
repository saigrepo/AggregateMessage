require('dotenv').config();

const config = {
    server: {
        port: 5400,
        corsOrigin: 'http://localhost:5173'
    },
    telegram: {
        apiId: Number(process.env.API_ID),
        apiHash: process.env.API_HASH
    },
    database: {
        localhost: 'localhost',
        port: 3308,
        dbName: process.env.DATABASE_NAME,
        dbUserName: process.env.DB_USERNAME,
        dbPassword: process.env.DB_PASSWORD
    }
};

module.exports = config;