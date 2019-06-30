const express = require('express');
const router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'Node.js Test' });
});

module.exports = router;
