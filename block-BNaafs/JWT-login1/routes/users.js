var express = require('express');
var router = express.Router();
var User = require('../models/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/registration', async (req,res,next)=> {
  try {
    const user = await User.create(req.body);
    res.status(200).json({user});
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req,res,next)=> {
  var {email,password} = req.body
  try {
    if(!email || !password){
      return res.status(400).json({msg : "Email/Password required"});
    }
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({msg : "Email not registered"});
    }
    const result = user.verifyPassword(password);
    if(!result){
      return res.status(400).json({msg : "Wrong Password"});
    }
    const token = await user.signToken();
    console.log(token);
    res.json({user : await user.userJSON(token)});

  } catch (error) {
    next(error);
  }
})



router.post('/login', async (req,res,next)=> {

})
module.exports = router;
