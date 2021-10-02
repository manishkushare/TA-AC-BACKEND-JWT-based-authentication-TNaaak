const express = require('express');
const router = express.Router();
var Article = require('../models/ArticleV1');
var auth = require('../middlewares/auth');
var slugPackage = require('slug');
var mongoose = require('mongoose');
var Comment = require('../models/CommentsV1');

// get articles by default
router.get('/', auth.verifyToken,async (req,res,next)=> {
    console.log("Hey");
    var query = req.query.tag? req.query.tag : req.query.author? req.query.author : req.query.favorited? req.query.favorited:null;
    var limit = req.query.limit? req.query.limit : 20;
    var offset = req.query.offset? req.query.offset : 0;
    console.log(query,limit,offset);
    try {
        if('tag' in req.query){
            
            var articles = await Article.find({taglist : query}).populate('author').limit(limit).skip(offset).sort({"createdAt" : -1});
            articles = await Promise.all(articles.map(async (article) =>  article.articleJSON(req.user,article.author)));
            return res.json({  articles , articlesCount : articles.length});
        }
        if('author' in query){
            var articles = await Article.find({}).populate({
                path : 'author',
                $match : {'author.username' : query}
            }).limit(limit).skip(offset).sort({"createdAt" : -1});
            articles = await Promise.all(articles.map(async (article) =>  article.articleJSON(req.user,article.author)));
            res.json({  articles , articlesCount : articles.length});

        } 
        
        
    } catch (error) {
        next(error);
    }
});

// feed articles
router.get('/feed', async (req,res,next)=> {
    const limit = req.query.limits? req.query.limit : 20;
    const offset = req.query.offset? req.query.offset :0;
    try {
        
    } catch (error) {
        
    }
});
//add comment to the article
router.post('/:slug/comments', auth.verifyToken,async (req,res,next)=> {
    const slug = req.params.slug;
    req.body.author = req.user.id;
    console.log("hey", slug, req.body.author);
    try {
        const article = await Article.findOne({slug});
        req.body.article = article.id;
        const comment = await Comment.create(req.body);
        console.log(comment);
        return res.json({comment : await comment.commentJSON(req.user,req.user)});
    } catch (error) {
        
    }
})

// get a single article
router.get('/:slug',auth.verifyToken, async (req,res,next)=> {
    const slug = req.params.slug;
    try { 
        const article = await Article.findOne({slug}).populate('author')
        res.json({article : await article.articleJSON(req.user, article.author)})
    } catch (error) {
        next(error);
    }
});


// get comments 
router.get('/:slug/comments', auth.verifyToken,async (req,res,next)=> {
    const slug = req.params.slug;
    try {
        const article = await Article.findOne({slug});
        let comments = await Comment.find({"article" : article.id}).populate('author');
        console.log(comments);
        comments = await Promise.all(comments.map(async (comment) =>  comment.commentJSON(req.user,comment.author)));
        return res.json({comments});
        

    } catch (error) {
        next(error);
    }
})

// delete comment
router.delete('/:slug/comments/:id',auth.verifyToken ,async (req,res,next)=> {
    const slug = req.params.slug;
    const id = req.params.id;
    console.log(slug,id);
    try {
        const deletedComment = await Comment.findByIdAndDelete(id);
        return res.json({ comment : deletedComment});
    } catch (error) {
        next(error);
    }
});

// post article
router.post('/', auth.verifyToken, async (req,res,next)=>{
    req.body.author = req.user.id;
    if(req.body.taglist && req.body.taglist.length >=1){
        req.body.taglist = req.body.taglist.split(',');
    } 
    try {
        const article = await Article.create(req.body);
        res.json({article :await article.articleJSON(req.user,req.user)});
    } catch (error) {
        next(error);
    }
});

// update article
router.put('/:slug',auth.verifyToken, async (req,res,next)=> {
    const slug = req.params.slug;
    if('title' in req.body){
        req.body.slug = await slugPackage(req.body.title);
    };
    try {
        const checkAuthority = await Article.findOne({slug}).populate('author');
        if(checkAuthority.author.id === req.user.id){
            const article = await Article.findOneAndUpdate({slug},req.body,{new : true});
            res.json({article : await article.articleJSON(req.user,checkAuthority.author)});
        }else {
            return res.status(403).json({
                errors : {
                    body : [
                        "You cannot update the article. Only Creator can update his/her article"
                    ]
                }
            })
        }

    } catch (error) {
        next(error);
    }
});

// delete article
router.delete('/:slug',auth.verifyToken, async (req,res,next)=> {
    const slug = req.params.slug;
    try {
        const checkAuthority = await Article.findOne({slug}).populate('author');
        if(checkAuthority.author.id === req.user.id){
            const deleteArticle = await Article.findOneAndDelete({slug});
            res.json({msg : "Deleted Article",article : await deletedArticle.articleJSON(req.user)});
        }else {
            return res.status(403).json({
                errors : {
                    body : [
                        "You cannot Delete the article. Only Creator can Delete his/her article"
                    ]
                }
            })
        }
        
    } catch (error) {
        next(error);
    }
});

// favorite article
router.post('/:slug/favorite',auth.verifyToken, async (req,res,next)=> {
    const slug = req.params.slug;
    console.log(slug);
    try {
        const checkArticle = await Article.findOne({slug}).populate('author');
        console.log(checkArticle, checkArticle.liked.includes(req.user.id))
        if(checkArticle.liked.includes(req.user.id)){
            return res.json({msg : "The article is already in your favorited list", article : await checkArticle.articleJSON(req.user,checkArticle.author)});
        } else{
            const article = await Article.findOneAndUpdate({slug},{$push : {liked : req.user.id}},{new: true}).populate('author');
            return res.json({article : await article.articleJSON(req.user,article.author)});
        }
    } catch (error) {
        next(error);
    }
});
// Unfavorite article
router.delete('/:slug/favorite',auth.verifyToken, async (req,res,next)=> {
    const slug = req.params.slug;
    console.log(slug);
    try {
        const checkArticle = await Article.findOne({slug}).populate('author');
        console.log(checkArticle, checkArticle.liked.includes(req.user.id))
        if(checkArticle.liked.includes(req.user.id)){
            const article = await Article.findOneAndUpdate({slug},{$pull : {liked : req.user.id}},{new: true}).populate('author');
            return res.json({article : await article.articleJSON(req.user,article.author)});
           
        } else{
            return res.json({msg : `The ${slug} article is not in your favorite list`, article : await checkArticle.articleJSON(req.user,checkArticle.author)});
        }
    } catch (error) {
        next(error);
    }
});
module.exports = router;