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
            id VARCHAR(255) UNIQUE NOT NULL,
            title TEXT,
            last_message TEXT,
            date BIGINT,
            unread_count BIGINT
        );
    `;
        try {
            if(!this.pgClient._connected ) {
                await this.connect();
            }
            await this.pgClient.query(query);
            console.log("Table 'teleconversation' created or already exists");
        } catch (err) {
            console.error("Error creating table", err.stack);
        }
    };

    async getConversations() {
        const query = `SELECT * FROM tele_conversation`;
        try {
            if(!this.pgClient._connected ) {
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
    VALUES ($1, $2, $3, $4, $5) 
    ON CONFLICT (id)
        DO UPDATE SET
                      last_message = EXCLUDED.last_message,
                      unread_count = EXCLUDED.unread_count;
`;
        try {
            await this.createTable();
            if (!this.pgClient._connected) {
                await this.connect();
            }
            await this.pgClient.query('BEGIN'); // Start the transaction
            for (const params of paramList?.conversations) {
                const res = await this.pgClient.query(query, [
                    params?.id,
                    params?.title,
                    params?.lastMessage,
                    params?.date,
                    params?.unreadCount,
                ]);
                console.log("inserted", res.rows[0]);
            }
            await this.pgClient.query('COMMIT');
            console.log("All records inserted successfully");
        } catch (err) {
            await this.pgClient.query('ROLLBACK');
            console.error("Error Inserting Table", err.stack);
        }
    }

    async createTableUser() {
        const query = `CREATE TABLE if not exists tele_user (
            telegram_id varchar(100),
            phone_number varchar(100),
            email_id varchar(100)
        );`;
        try {
            await this.pgClient.query(query);
            console.log("create tele user table");
        } catch (e) {
            console.log("error creating table", e.stack);
        }
    }

    async insertIdAndNumber(params) {
        const query = `INSERT INTO tele_user (telegram_id, phone_number)
                VALUES ($1, $2, $3) RETURNING *`
        if(!this.pgClient._connected) {
            await this.connect();
        }
        try {
            await this.createTableUser();
            const res = await this.pgClient.query(query, [params.telegramId, params.phoneNumber, params.emailId]);
            console.log(res.rows[0]);
        } catch (err) {
            console.error("error iin inserting", err);
        }
    }

    async getUserByEmail(params) {
        const { emailId } = params;
        const query = `SELECT * FROM tele_user where email_id = ($1)`;
        if(!this.pgClient._connected) {
            await this.connect();
        }
        try {
            const res = await this.pgClient.query(query, [emailId]);
            console.log(res.rows[0]);
        } catch (err) {
            console.error("error in retrieving", err);
        }
    }
}

module.exports = new TelegramDbService();