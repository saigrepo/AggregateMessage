const express = require('express');
const router = express.Router();
const telegramService = require('../services/telegramService');

router.get("/api/telegram-conversations", async (req, res, next) => {
  try {
    await telegramService.connect();
    const conversations = await telegramService.getConversations();
    res.json({ success: true, conversations });
  } catch (error) {
    next(error);
  }
});

router.post("/api/telegram-login", async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;
    const result = await telegramService.sendLoginCode(phoneNumber);
    res.json({ success: true, phoneCodeHash: result.phoneCodeHash });
  } catch (error) {
    next(error);
  }
});

router.post("/api/telegram-verify-code", async (req, res, next) => {
  try {
    const sessionString = await telegramService.verifyLoginCode(req.body);
    res.json({ success: true, sessionString });
  } catch (error) {
    next(error);
  }
});

router.post("/api/telegram-verify-twoFactor", async (req, res, next) => {
  try {
    const sessionString = await telegramService.verify2FAPassword(req.body);
    res.json({ success: true, sessionString });
  } catch (error) {
    next(error);
  }
});

router.get("/api/telegram/status", (req, res) => {
  const status = telegramService.getConnectionStatus();
  res.json({ success: true, ...status });
});

module.exports = router;

