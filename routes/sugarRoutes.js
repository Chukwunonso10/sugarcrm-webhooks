const express = require('express');
const  handleSugarWebhook = require('../controllers/sugarControllers');

const router = express.Router();

router.post('/sugar-webhook', handleSugarWebhook);

module.exports = router;
