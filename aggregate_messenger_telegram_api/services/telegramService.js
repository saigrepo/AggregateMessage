const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const config = require('../config');

class TelegramService {
    constructor() {
        this.stringSession = new StringSession("");
        this.client = new TelegramClient(
            this.stringSession,
            config.telegram.apiId,
            config.telegram.apiHash,
            { connectionRetries: 2 }
        );
    }

    async connect() {
        await this.client.connect();
        console.log('Telegram client connected');
    }

    async setupMessageHandler(messageCallback) {
        this.client.addEventHandler(async (event) => {
            const message = this.formatMessage(event.message);
            messageCallback(message);
        }, new NewMessage({}));
    }

    formatMessage(message) {
        return {
            messageId: message.id,
            chatId: message.chatId.toString(),
            senderId: message.senderId?.toString(),
            message: message.text,
            timestamp: new Date(message.date * 1000)
        };
    }

    async sendMessage(chatId, message) {
        const result = await this.client.sendMessage(chatId, { message });
        return this.formatMessage(result);
    }

    async getChatHistory(chatId, limit = 50) {
        const messages = await this.client.getMessages(chatId, { limit });
        return messages.map(msg => this.formatMessage(msg));
    }

    async getConversations() {
        await this.connect();
        const result = await this.client.getDialogs({
            apiId: config.telegram.apiId,
            apiHash: config.telegram.apiHash
        });
        return result.map(dialog => ({
            id: dialog.id,
            title: dialog.title,
            lastMessage: dialog.lastMessage ? dialog.lastMessage.message : null,
            date: dialog.lastMessage ? dialog.lastMessage.date : null,
            unreadCount: dialog.unreadCount,
            version: dialog.version
        }));
    }

    async sendLoginCode(phoneNumber) {
        await this.connect();
        const result = await this.client.sendCode({
            apiId: config.telegram.apiId,
            apiHash: config.telegram.apiHash,
        }, phoneNumber);
        return result;
    }

    async verifyLoginCode(params) {
        await this.connect();
        const { phoneNumber, phoneCode } = params;
        await this.client.signInUser(
            { apiId: config.telegram.apiId, apiHash: config.telegram.apiHash },
            {
                phoneNumber,
                phoneCode: () => phoneCode,
                onError: (err) => { throw err; }
            }
        );
        return this.client.session.save();
    }

    async verify2FAPassword(params) {
        const { phoneNumber, phoneCode, phoneCodeHash, password } = params;
        await this.client.signInWithPassword(
            { apiId: config.telegram.apiId, apiHash: config.telegram.apiHash },
            {
                password: password.toString(),
                phoneNumber,
                phoneCode: () => phoneCode,
                phoneCodeHash,
                onError: (err) => { throw err; }
            }
        );
        return this.client.session.save();
    }

    getConnectionStatus() {
        return {
            connected: this.client.connected,
            sessionAvailable: Boolean(this.stringSession)
        };
    }
}

module.exports = new TelegramService();