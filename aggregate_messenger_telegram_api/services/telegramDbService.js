const {Client} = require("pg");
const config = require('../config');

class TelegramDbService {

    constructor() {
        this.pgClient = new Client(
            {
                host: config.database.localhost,
                user: config.database.dbUserName,
                password: config.database.dbPassword,
                database: config.database.dbName,
                port: config.database.port,
            });
    }

    async connect() {
        await this.pgClient.connect();
        console.log("Connected to postgres");
    }

     async createTable() {
        const query = `
        CREATE TABLE IF NOT EXISTS tele_conversation (
            id VARCHAR(100),
            title VARCHAR(100),
            last_message VARCHAR(100),
            date BIGINT,
            unread_count BIGINT
        );
    `;
        try {
            await this.connect();
            await this.pgClient.query(query);
            console.log("Table 'teleconversation' created or already exists");
        } catch (err) {
            console.error("Error creating table", err.stack);
        }
    };

    async getConversations() {
        const query = `SELECT * FROM tele_conversation`;
        try {
            if(!this.pgClient._connected || this.pgClient._ended) {
                await this.connect();
            }
            const res = await this.pgClient.query(query);
            return res.rows.map((conv) => ({
                id: conv.id,
                title: conv.title,
                lastMessage: conv?.last_message,
                date: conv.date,
                unreadCount: conv.unread_count
            }));
        } catch (err) {
            console.error("error fetching all conversations", err.stack);
        }
    }

    async insertConversation(paramList) {
        const query = `
            INSERT INTO tele_conversation (id, title, last_message, date, unread_count) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *
        `
        try {
            await this.createTable();
            if(this.pgClient._ended || !this.pgClient._connected) {
                await this.connect();
            }
            for(const params of paramList?.conversations) {
                const res = await this.pgClient.query(query, [params?.id, params?.title, params?.lastMessage, params?.date, params?.unreadCount]);
                console.log("inserted", res.rows[0]);
            }
            console.log("inserted");
        } catch (err) {
            console.error("Error Inserting Table", err.stack);
        } finally {
            await this.pgClient.end();
            console.log("PostgreSQL connection closed")
        }
    }
}

module.exports = new TelegramDbService();