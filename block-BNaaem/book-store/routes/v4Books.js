var express = require('express');
var router = express.Router();
var Books = require('../models/V4Books');
var Comments = require('../models/V1Comments');
var auth = require('../middlewares/auth');
var User = require('../models/V1User');

router.get('/',async (req,res,next)=> {
    try {
        var books =await Books.find({});
        res.status(200).json({books});
    } catch (error) {
        next(error);
    }
});

// create a book 
router.post('/', auth.verifyToken, async(req,res,next)=> {
    req.body.categories = req.body.categories.trim().split(',');
    req.body.tags = req.body.tags.trim().split(',');
    try {
        console.log("Hey", req.body)
        var addedBook = await Books.create(req.body);

        res.status(200).json({addedBook});
    } catch (error) {
        next(error);
    }
});

router.get('/categories', async (req,res,next)=> {
    try {
        const allCategories = await Books.distinct("categories");
        console.log(allCategories);
        res.status(200).json({allCategories});
    } catch (error) {
        next(error);
    }
});
router.get('/tags', async (req,res,next)=> {
    try {
        const allTags = await Books.distinct("tags");
        console.log(allTags);
        res.json({allTags});    
    } catch (error) {
        next(error);
    }
});
router.get('/tags/ascending', async (req,res,next)=> {
    try {
        let allTags = await Books.distinct("tags");
        console.log(allTags);
        allTags = allTags.sort((a,b)=> a.localeCompare(b));
        res.json({allTags});    
    } catch (error) {
        next(error);
    }
});

router.get('/tags/descending', async (req,res,next)=> {
    try {
        let allTags = await Books.distinct("tags");
        console.log(allTags);
        allTags = allTags.sort((a,b)=> b.localeCompare(a));
        res.json({allTags});    
    } catch (error) {
        next(error);
    }
});
router.get('/list-book-by-tags', async (req,res,next)=> {
    const tag = req.query.tag;
    try {
        const books = await Books.find({tags : tag});
        console.log(books);
        res.json({books});
    } catch (error) {
        next(error);
    }
});
router.get('/count-books-by-tag', async(req,res,next)=> {
    const tag = req.query.tag;
    try {
        const bookCount = await Books.count({tags : tag});
        console.log(bookCount);
        res.json({category : bookCount});
    } catch (error) {
        next(error);
    }
})

router.get('/list-books-by-category/', async (req,res,next)=> {
    const category = req.query.category;
    console.log(category);
    try {
        const books = await Books.find({categories : category});
        console.log(books);
        res.json({books});
    } catch (error) {
        next(error);
    }
});

router.get('/count-books-by-category', async(req,res,next)=> {
    const category = req.query.category;
    try {
        const bookCount = await Books.count({categories : category});
        console.log(bookCount);
        res.json({category : bookCount});
    } catch (error) {
        next(error);
    }
})

router.get('/:id', async(req,res,next)=> {
    var id = req.params.id;
    try {
        var singleBook = await Books.findById(id).populate("commentsId");
        res.status(200).json({singleBook});
    } catch (error) {
        next(error)
    }
})

router.put('/:id',auth.verifyToken, async(req,res,next)=> {
    const id = req.params.id;
    req.body.categories = req.body.categories.trim().split(',');
    req.body.tags = req.body.tags.trim().split(',');
    try {   
        const updatedBook =await Books.findByIdAndUpdate(id,req.body);
        res.status(200).json({updatedBook});
    } catch (error) {
        next(error);
    }
})

router.delete('/:id',auth.verifyToken ,async(req,res,next)=> {
    const id = req.params.id;
    try {   
        const deletedBook =await Books.findByIdAndDelete(id);
        res.status(200).json({deletedBook});
    } catch (error) {
        next(error);
    }
})

router.post('/:id/addComment', auth.verifyToken, async(req,res,next)=> {
    const id = req.params.id;
    req.body.bookRef = id; 
    console.log(req.body);
    try {
        const addedComment = await Comments.create(req.body);
        const updatedBook = await Books.findByIdAndUpdate(id, {$push : {"commentsId" : addedComment.id}});
        res.status(200).send({addedComment,updatedBook});
    }
     catch (error) {
        next(error)
    }
});

router.get('/:id/add-to-cart', auth.verifyToken ,async (req,res,next)=> {
    const id = req.params.id;
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user.user, {$push : {cart : id}});
        res.json({updatedUser});
    } catch (error) {
        next(error);
    }
});
router.get('/:id/remover-from-cart', auth.verifyToken ,async (req,res,next)=> {
    const id = req.params.id;
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user.user, {$pull : {cart : id}});
        res.json({updatedUser});
    } catch (error) {
        next(error);
    }
});

module.exports = router;