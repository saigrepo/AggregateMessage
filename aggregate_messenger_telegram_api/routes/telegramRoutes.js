const express = require('express');
const router = express.Router();
const telegramService = require('../services/telegramService');
const telegramDbService = require('../services/telegramDbService');

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
    const response = await telegramService.verifyLoginCode(req.body);
    res.json({ success: true, ...response });
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

router.get("/api/telegram-current-user", (req, res, next) => {
  const userId =  telegramService.getCurrentUser();
  res.json({success: true, telegramId: userId})
});

router.post("/api/telegram-insert-conversation", async (req, res, next) => {
  try {
    const response =  telegramDbService.insertConversation(req.body);
    res.json({success: true, message:"inserted SuccessFully"});
  } catch (err) {
    next(err);
  }
});

router.get("/api/telegram-get-conversations", async (req, res, next) => {
  try {
    const response =  await telegramDbService.getConversations();
    res.json({success: true, conversations: response});
  } catch (err) {
    next(err);
  }
});

module.exports = router;

