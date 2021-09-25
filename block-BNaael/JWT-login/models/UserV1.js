const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    name : {
        type : String
    },
    email : {
        type : String,
        unique : true,
        required: true
    },
    password : {
        type : String,
        required: true
    }
});

userSchema.pre('save', async function(next){
    try {
        if(this.password && this.isModified('password')){
            this.password =await bcrypt.hash(this.password,10);
            next();
        }
    } catch (error) {
        next(error);
    }
});

userSchema.methods.verifyPassword = async function(password){
    try {
        const result =await bcrypt.compare(password,this.password);
        return result
    } catch (error) {
        return error;
    }
}

module.exports = mongoose.model('UserV1', userSchema);