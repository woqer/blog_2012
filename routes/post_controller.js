
var model = require('../models.js');


/*
*  Auto-loading con app.param
*/
exports.load = function(req, res, next, id) {

   model.Post
        .find(Number(id))
        .success(function(post) {
            if (post) {
                req.post = post;
		next();
            } else {
                next('No existe el post con id='+id+'.');
            }
        })
        .error(function(error) {
            next(error);
        });
};


// GET /posts
exports.index = function(req, res, next) {

    model.Post
        .findAll({order: 'updatedAt DESC'})
        .success(function(posts) {
            res.render('posts/index', {
                posts: posts
            });
            
        })
        .error(function(error) {
            next(error);
        });
};

// GET /posts/33
exports.show = function(req, res, next) {

    res.render('posts/show', {
        post: req.post
    });
};

// GET /posts/new
exports.new = function(req, res, next) {

    var post = model.Post.build(
        { title:  'Introduzca el titulo',
          body: 'Introduzca el texto del articulo'
        });
    
    res.render('posts/new', {post: post});
};

// POST /posts
exports.create = function(req, res, next) {

    var post = model.Post.build(
        { title: req.body.post.title,
          body: req.body.post.body,
          authorId: 0
        });
    
    var validate_errors = post.validate();
    if (validate_errors) {
        console.log("Errores de validacion:", validate_errors);
        res.render('posts/new', {post: post});
        return;
    } 
    
    post.save()
        .success(function() {
            res.redirect('/posts');
        })
        .error(function(error) {
            next(error);
        });
};

// GET /posts/33/edit
exports.edit = function(req, res, next) {

    res.render('posts/edit', {post: req.post});
};

// PUT /posts/33
exports.update = function(req, res, next) {

    req.post.title = req.body.post.title;
    req.post.body = req.body.post.body;
                
    var validate_errors = req.post.validate();
    if (validate_errors) {
        console.log("Errores de validacion:", validate_errors);
        res.render('posts/edit', {post: req.post});
        return;
    } 
    req.post.updateAttributes({ title: req.post.title,
                                body:  req.post.body })
        .success(function() {
            res.redirect('/posts');
        })
        .error(function(error) {
            next(error);
        });
};

// DELETE /posts/33
exports.destroy = function(req, res, next) {

    req.post.destroy()
        .success(function() {
            res.redirect('/posts');
        })
        .error(function(error) {
            next(error);
        });
};
