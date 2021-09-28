const mongoose = require('mongoose');
const Schema = mongoose.Schema;  
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
    name : {
        type : String
    },
    email : {
        type : String,
        unique : true
    },
    password : {
        type : String
    }
});

userSchema.pre('save', async function(next){
    try {
        if(this.password && this.isModified('password')){
            this.password = await bcrypt.hash(this.password, 10);
            next();
        }else {
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
            user : this.id,
            email : this.email,
            name : this.name
        };
        const token = await jwt.sign(payload, process.env.SECRET);
        return token;
    } catch (error) {
        return error;
    }
};

userSchema.methods.userJSON = async function(token){
    try {
        return {
            "name" : this.name,
            "email" : this.email,
            "token" : token,
            "user" : this.id
        }
    } catch (error) {
        return error;
    }
}

module.exports = mongoose.model('User', userSchema);