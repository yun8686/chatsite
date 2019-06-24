const express = require('express');
const app = express();
const router = express.Router();
module.exports = router;

router.get('/api/login', function (req, res) {
  res.json({ error: 'Bad credentials' })
});
