const express = require('express');
const router = express.Router();
const telegramService = require('../services/telegramService');
const telegramDbService = require('../services/telegramDbService');

router.post("/api/telegram-conversations", async (req, res, next) => {
  try {
    if(res.body?.sessionString) {
      telegramService.stringSession = res.body?.sessionString;
    }
    await telegramService.connect();
    const conversations = await telegramService.getConversations();
    res.json({ success: true, conversations });
  } catch (error) {
    next(error);
  }
});

router.post("/api/telegram-login", async (req, res, next) => {
  if(!res.body?.sessionString) {
    try {
      const { phoneNumber } = req.body;
      const result = await telegramService.sendLoginCode(phoneNumber);
      res.json({ success: true, phoneCodeHash: result.phoneCodeHash });
    } catch (error) {
      next(error);
    }
  } else {
    telegramService.stringSession = res.body?.sessionString;
    await telegramService.connect();
    res.json({success: true, alreadyConnected: true});
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

router.post("/api/telegram-insert-user", async (res, req, nxt) => {
  try {
    const res =  await telegramDbService.insertIdAndNumber(req.body);
    res.json({success: true, message: "values inserted to user table successfully"});
  } catch (err) {
    nxt(err);
  }
});

router.post("/api/telegram-get-user", async (res, req, nxt) => {
  try {
    const res =  await telegramDbService.getUserByEmail(req.body);
    res.json({success: true, ...res});
  } catch (err) {
    nxt(err);
  }
});

router.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  try {
    const response = await fetch(targetUrl);
    const data = await response.text(); // Use `.text()` to forward raw HTML
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: "Unable to fetch the requested URL." });
  }
});

module.exports = router;

