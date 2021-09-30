const express = require('express');
const router = express.Router();
var User = require('../models/V1User');
var auth = require('../middlewares/auth');

router.post('/registration', async (req,res,next)=> {
    try {
        const user = await User.create(req.body);
        res.json({user});
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req,res,next)=> {
    var {email,password} = req.body;    
    try {
        if(!email || !password){
            return res.json({msg : "Email/Password required"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({msg : "Email is not registered"});
        }
        const result = await user.verifyPassword(password);
        if(!result){
            return res.status(400).json({msg : "Password Incorrect"});
        }
        const token = await user.signToken();
        res.json({user : await user.userJSON(token)});
    } catch (error) {
        next(error);
    }
})

module.exports = router;