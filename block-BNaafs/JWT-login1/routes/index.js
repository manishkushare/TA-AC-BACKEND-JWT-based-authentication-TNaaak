var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/dashboard', auth.verifyToken, async (req,res,next)=> {
  try {
    res.json({msg : "access protected"});
  } catch (error) {
    next(error);
  }
})

module.exports = router;
