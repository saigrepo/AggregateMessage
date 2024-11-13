const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const socketIo = require("socket.io");
const http = require("http");
const { NewMessage } = require("telegram/events");
const { version } = require("os");

require('dotenv').config();
const app = express();
const apiId = Number(process.env.API_ID);
const apiHash = process.env.API_HASH;
let stringSession = new StringSession("");

// Create HTTP server with Express app
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: 'http://localhost:5173' },
});

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(bodyParser.json());

const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 2,
});

// Socket.IO connection handling
io.on("connection", (socket) => {
    console.log("New client connected");

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

// Listen for new Telegram messages
client.addEventHandler((event) => {
    const message = event.message;

    // Emit the message to all connected clients
    io.emit("newTelegramMessage", {
        sender: message.senderId,
        content: message.message,
        date: message.date,
    });
}, new NewMessage());

// API route to fetch Telegram conversations
app.get("/api/telegram-conversations", async (req, res) => {
    try {
        console.log("Fetching conversations");
        await client.connect(); // Ensure the client is connected

        const result = await client.getDialogs(); // Fetch the dialogs
        const conversations = result.map(dialog => ({
            id: dialog.id,
            title: dialog.title,
            lastMessage: dialog.lastMessage ? dialog.lastMessage.message : null,
            date: dialog.lastMessage ? dialog.lastMessage.date : null,
            unreadCount: dialog.unreadCount,
            version: dialog.version
        }));
        console.log(conversations);

        res.json({ success: true, conversations });
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ success: false, message: "Failed to fetch conversations" });
    }
});

// API route to fetch Telegram contacts
app.get("/api/telegram-contacts", async (req, res) => {
    try {
        console.log("Fetching contacts");
        await client.connect(); // Ensure the client is connected

        const result = await client.sendMessage(Phone); // Fetch the contacts
        const contacts = result.map(contact => ({
            id: contact.id,
            firstName: contact.firstName,
            lastName: contact.lastName,
            username: contact.username,
            phone: contact.phone
        }));

        res.json({ success: true, contacts });
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ success: false, message: "Failed to fetch contacts" });
    }
});

app.post("/api/telegram-login", async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        console.log("Starting login process");
        await client.connect();
        const result = await client.sendCode({
            apiId,
            apiHash,
        }, phoneNumber);
        console.log("Code sent, result:", result);
        res.json({ success: true, phoneCodeHash: result.phoneCodeHash });
    } catch (error) {
        console.error("Error sending code:", error);
        res.status(500).json({ success: false, message: "Failed to send code" });
    }
});
app.post("/api/telegram-login-twoFactor", async (req, res) => {
    const { phoneNumber, phoneCode, phoneCodeHash, password } = req.body;
    await client.connect();
    try {
        // Sign in with 2FA password
        await client.signInWithPassword({
                apiId,
                apiHash,
            },
            {
                password: password.toString(),
                phoneNumber,
                phoneCode: (isCodeViaApp= true) => { return phoneCode},
                phoneCodeHash,
                onError: (err) => console.log(err)
            }
        );
    } catch (passwordError) {
        console.error("2FA login error:", passwordError);
        return res.status(401).json({
            success: false,
            message: "Invalid 2FA password"
        });
    }

    const sessionString = client.session.save();
    stringSession = sessionString; // Save for future use

    return res.json({
        success: true,
        sessionString: sessionString
    });
});

app.post("/api/telegram-login-code", async (req, res) => {
    const { phoneNumber, phoneCode, phoneCodeHash, password } = req.body;
    await client.connect();
    try {
        if (!phoneCode) {
            return res.status(400).json({
                success: false,
                message: "Verification code is required"
            });
        }
        try {
            await client.signInUser({ apiId, apiHash },
                {
                    phoneNumber: phoneNumber,
                    phoneCode: (isCodeViaApp= true) => { return phoneCode},
                    onError: (err) => console.log(err)
                }
            );
        } catch (error) {
            console.error("Initial sign in error:", error);
            if (error.message.includes('SESSION_PASSWORD_NEEDED')) {
                if (!password) {
                    return res.status(400).json({
                        success: false,
                        requiresPassword: true,
                        message: "2FA password required"
                    });
                }
            } else {
                throw error;
            }
        }
        const sessionString = client.session.save();
        stringSession = sessionString; // Save for future use

        return res.json({
            success: true,
            sessionString: sessionString
        });
    } catch (error) {
        console.error("Login verification error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to verify login code"
        });
    }
});

// Helper route to check the current connection status
app.get("/api/connection-status", async (req, res) => {
    try {
        const isConnected = client.connected;
        res.json({
            success: true,
            connected: isConnected,
            sessionAvailable: Boolean(stringSession)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to check connection status"
        });
    }
});


// Start the server
server.listen(5400, () => {
    console.log("Server running on port 5400");
});
