var jwt = require('jsonwebtoken');

module.exports = {
    verifyToken : async (req,res,next)=> {
        const token = req.headers.authorization;
        try {
            if(token){
                var payload = await jwt.verify(token, process.env.SECRET);
                req.user= payload;
                next();
            } else{
                res.status(400).json({msg : "Token required"});
            }   
        } catch (error) {
            next(error);
        }
        
    }
}