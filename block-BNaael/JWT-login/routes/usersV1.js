var express = require('express');
var router = express.Router();
var User = require('../models/UserV1');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/registration', async (req,res,next)=> {
  try {
    const user = await User.create(req.body);
    res.status(201).json({user});
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req,res,next)=> {
  const {email,password} = req.body;
  if(!email || !password){
    return res.status(400).json({error : "Email/Password is required"});
  }
  try {
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({error : "User not found"});
    }
    const verify = await user.verifyPassword(password);
    if(!verify){
      return res.status(400).json({error : "Password does not match"});
    }
  } catch (error) {
    next(error);
  }
})

module.exports = router;
