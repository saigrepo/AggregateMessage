require('dotenv').config();

const config = {
    server: {
        port: 5400,
        corsOrigin: 'http://localhost:5173'
    },
    telegram: {
        apiId: Number(process.env.API_ID),
        apiHash: process.env.API_HASH
    }
};

module.exports = config;