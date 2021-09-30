var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({msg : "welcome"});
});

router.get('/protected', auth.verifyToken, async (req,res,next)=> {
  try {
    res.json({msg : "access protected"})
  } catch (error) {
    next(error);
  }
})

module.exports = router;
