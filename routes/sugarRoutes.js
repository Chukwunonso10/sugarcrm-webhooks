const express = require('express');
const  sugarController = require('../controllers/sugarControllers');

const router = express.Router();

router.post('/sugar-webhook', sugarController);

module.exports = router;
