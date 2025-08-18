const express = require('express');
const  { handleSugarWebhook, healthCheck } = require('../controllers/sugarControllers');

const router = express.Router();

router.post('/', handleSugarWebhook);
router.get('/', healthCheck);

module.exports = router;
