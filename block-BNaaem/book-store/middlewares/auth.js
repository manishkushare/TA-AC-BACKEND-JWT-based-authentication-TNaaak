const jwt = require('jsonwebtoken');

module.exports = {
    verifyToken : async (req,res,next)=> {
        console.log(req.headers);
        const token = req.headers.authorization;
        try {
            if(token){
                const payload =  jwt.verify(token, process.env.SECRET);
                console.log(payload);
                req.user = payload;
                next();
            } else {
                res.status(400).json({msg : "Token required"});
            }    
        } catch (error) {
            next(error);
        }
        
    }
}