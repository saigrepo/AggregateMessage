const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage} = require("telegram/events");
const config = require('../config');
const {message} = require("telegram/client");

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
            receiverId: message.peerId?.userId?.toString(),
            message: message.text,
            timestamp: new Date(message.date * 1000)
        };
    }

    async getCurrentUser() {
        if(!this.client.connected) {
            await this.connect();
        }
        return (await this.client.getMe())?.id;
    }

    async sendMessage(chatId, message) {
        if(!this.client.connected) {
            await this.connect();
        }
        const result = await this.client.sendMessage(chatId, { message });
        return this.formatMessage(result);
    }

    async getChatHistory(chatId, limit = 10) {
        if(!this.client.connected) {
            await this.connect();
        }
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
            lastMessage: dialog.message ? dialog.message.message : null,
            date: dialog.message ? dialog.message.date : null,
            unreadCount: dialog.unreadCount
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
        const { phoneNumber, phoneCode } = params;
        try {
            await this.connect();
            await this.client.signInUser(
                { apiId: config.telegram.apiId, apiHash: config.telegram.apiHash },
                {
                    phoneNumber,
                    phoneCode: () => phoneCode,
                    onError: (err) => { throw err; }
                }
            );
            const user = await this.client.getMe();
            return {token: this.client.session.save(), telegramId: user?.id};
        } catch (error) {
            if(error.code == 420 && error.message.includes('seconds')) {
                return {success: false, message: error.message}
            }
        }
    }

    async verify2FAPassword(params) {
        const { phoneNumber, phoneCode, phoneCodeHash, password } = params;
        await this.connect();
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