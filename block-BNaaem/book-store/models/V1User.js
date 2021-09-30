const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
    name : {
        type: String
    },
    email : {
        type : String,
        unique : true,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    cart : [
        {
            type : Schema.Types.ObjectId,
            ref : "V4Book"
        }
    ]
});

userSchema.pre('save', async function(next){
    try {
        if(this.password && this.isModified('password')){
            this.password = await bcrypt.hash(this.password,10);
            return next();
        } else {
            next();
        }
    } catch (error) {
        next(error);
    }
});

userSchema.methods.verifyPassword = async function(password){
    try {
        const result = await bcrypt.compare(password, this.password);
        return result;
    } catch (error) {
        return error;
    }
};

userSchema.methods.signToken = async function(){
    try {
        var payload = {
            email : this.email,
            name : this.name,
            user : this.id
        };
        const token =  jwt.sign(payload, process.env.SECRET);
        return token;
    } catch (error) {
        return error;
    }
};

userSchema.methods.userJSON = async function(token){
    try {
        return {
            email :this.email,
            name : this.name,
            user : this.id,
            token : token
        }
    } catch (error) {
        
    }
}

module.exports = mongoose.model('UserV1', userSchema);