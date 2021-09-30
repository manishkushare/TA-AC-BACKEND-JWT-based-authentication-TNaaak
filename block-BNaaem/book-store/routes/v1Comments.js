const { closeDelimiter } = require('ejs');
var express = require('express');
var router = express.Router();
var Comments = require('../models/V1Comments')
var Books = require('../models/v2Books');
router.put('/:id', async (req,res,next)=> {
    try {
        const id = req.params.id;
        var updatedComment = await Comments.findByIdAndUpdate(id,req.body);
        res.status(200).json({updatedComment});
    } catch (error) {
        next(error);
    }
});


router.delete('/:id', async (req,res,next)=> {
    try {
        const id = req.params.id;   
        var deletedComment = await Comments.findByIdAndDelete(id);
        deletedComment =await deletedComment.populate("bookRef");
        console.log("populated data :", deletedComment);
        var updatedBooks = await Books.findByIdAndUpdate(deletedComment.bookRef.id, {$pull : {commentsId : id}})
        res.status(200).json({deletedComment,updatedBooks});
    } catch (error) {
        next(error);
    }
});
module.exports = router;