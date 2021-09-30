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
    ]
}, {
    strict: false
      });

module.exports = mongoose.model('V2Book', bookSchema);