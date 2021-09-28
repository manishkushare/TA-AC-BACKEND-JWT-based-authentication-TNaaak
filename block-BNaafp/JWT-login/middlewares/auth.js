var jwt = require('jsonwebtoken');

module.exports = {
    verifyToken : async (req,res,next)=> {
        console.log(req.headers);
        var token = req.headers.authorization;
        try {
            if(token){
                var payload = await jwt.verify(token, "secretkey");
                req.user = payload;
                return next();
            } else{
                res.status(400).json({msg : "Token  required"});
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}