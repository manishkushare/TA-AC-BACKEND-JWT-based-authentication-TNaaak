var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
    name : {
        type : String,

    },
    author : {
        type : String
    },
    description : {
        type : String
    },
    commentsId : [
        {
        type : Schema.Types.ObjectId,
        ref : "V1Comments"
        }
    ],
    categories : [String],
    tags : [String],
    price : {
        type : Number
    },
    quantity : {
        type : Number
    }
});

module.exports = mongoose.model('V4Book', bookSchema);