class SocketHandler {
    constructor(io, telegramService) {
        this.io = io;
        this.telegramService = telegramService;
        this.setupSocketHandlers();
    }

    setupSocketHandlers() {
        this.io.on('connection', (socket) => {
            console.log('New web client connected');

            socket.on('send-message', this.handleSendMessage.bind(this, socket));
            socket.on('get-chat-history', this.handleGetChatHistory.bind(this, socket));
            socket.on('disconnect', () => console.log('Web client disconnected'));
        });

        // Setup Telegram message handler
        this.telegramService.setupMessageHandler((message) => {
            this.io.emit('telegram-message', message);
        });
    }

    async handleSendMessage(socket, data) {
        try {
            const result = await this.telegramService.sendMessage(data.chatId, data.message);
            socket.emit('message-sent', result);
        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('message-error', {
                error: 'Failed to send message to Telegram'
            });
        }
    }

    async handleGetChatHistory(socket, chatId) {
        try {
            const messages = await this.telegramService.getChatHistory(chatId);
            messages.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));
            console.log(messages);
            socket.emit('chat-history', messages);
        } catch (error) {
            console.error('Error fetching message history:', error);
            socket.emit('chat-history-error', {
                error: 'Failed to fetch message history'
            });
        }
    }
}

module.exports = SocketHandler;