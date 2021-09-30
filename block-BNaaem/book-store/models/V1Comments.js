var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    content : {
        type : String
    },
    author : {
        type : String
    },
    bookRef : {
        type : Schema.Types.ObjectId,
        ref : "V2Book"
    }
},{strict: false})
module.exports = mongoose.model('V1Comments', commentSchema);