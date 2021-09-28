var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/protected',auth.verifyToken, async(req,res,next)=> {
  try {
    console.log(req.user);
    res.json({access : "Proetcted route"});
  } catch (error) {
    next(error)
  }
})

module.exports = router;
