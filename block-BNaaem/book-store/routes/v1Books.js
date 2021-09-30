var express = require('express');
var router = express.Router();
var Books = require('../models/v1Book');  
router.get('/',async (req,res,next)=> {
    try {
        var books =await Books.find({});
        res.status(200).json({books});
    } catch (error) {
        next(error);
    }
});

// create a book 
router.post('/', async(req,res,next)=> {
    try {
        console.log("Hey", req.body)
        var addedBook = await Books.create(req.body);

        res.status(200).json({addedBook});
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async(req,res,next)=> {
    var id = req.params.id;
    try {
        var singleBook = await Books.findById(id);
        res.status(200).json({singleBook});
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async(req,res,next)=> {
    const id = req.params.id;
    try {   
        const updatedBook =await Books.findByIdAndUpdate(id,req.body);
        res.status(200).json({updatedBook});
    } catch (error) {
        next(error);
    }
})

router.delete('/:id', async(req,res,next)=> {
    const id = req.params.id;
    try {   
        const deletedBook =await Books.findByIdAndDelete(id);
        res.status(200).json({deletedBook});
    } catch (error) {
        next(error);
    }
})
module.exports = router;