
var models = require('../models/models.js');

var userController = require('./user_controller');

/*
*  Auto-loading con app.param
*/
exports.load = function(req, res, next, id) {

   models.Comment
        .find({where: {id: Number(id)}})
        .success(function(comment) {
            if (comment) {
                req.comment = comment;
                next();
            } else {
                req.flash('error', 'No existe el comentario con id='+id+'.');
                next('No existe el comentario con id='+id+'.');
            }
        })
        .error(function(error) {
            next(error);
        });
};


/*
* Comprueba que el usuario logeado es el author.
*/
exports.loggedUserIsAuthor = function(req, res, next) {
    
    if (req.session.user && req.session.user.id == req.comment.authorId) {
        next();
    } else {
        console.log('Operación prohibida: El usuario logeado no es el autor del comentario.');
        res.send(403);
    }
};

//-----------------------------------------------------------


// GET /posts/33/comments
exports.index = function(req, res, next) {

    models.Comment
        .findAll({where: {postId: req.post.id},
                  order: 'updatedAt DESC',
                  include: [ {model: models.User, as: 'Author'} ]})
        .success(function(comments) {
            res.render('comments/index', {
                comments: comments,
                post: req.post
            });
        })
        .error(function(error) {
            next(error);
        });
};

// GET /posts/33/comments/66
exports.show = function(req, res, next) {

   // Buscar el autor del post
    models.User
        .find({where: {id: req.post.authorId}})
        .success(function(user) {

            // Añado el autor del post como el atributo "author". 
            // Si no encuentro el autor uso el valor {}.
            req.post.author = user || {};

            // Buscar el autor del comentario
            models.User
                .find({where: {id: req.comment.authorId}})
                .success(function(user) {

                    // Añado el autor del comentario como el atributo "author".
                    // Si no encuentro el autor uso el valor {}.
                    req.comment.author = user || {};

                    res.render('comments/show', {
                        comment: req.comment,
                        post: req.post
                    });
                })            
                .error(function(error) {
                    next(error);
                });
        })
        .error(function(error) {
            next(error);
        });
};

// GET /posts/33/comments/new
exports.new = function(req, res, next) {

    var comment = models.Comment.build(
        { body: 'Introduzca el texto del comentario'
        });
    
    res.render('comments/new', {comment: comment,
                                post: req.post
                               });
};

// POST /posts/33/comments
exports.create = function(req, res, next) {

    var comment = models.Comment.build(
        { body: req.body.comment.body,
          authorId: req.session.user.id,
          postId: req.post.id
        });
    
    var validate_errors = comment.validate();
    if (validate_errors) {
        console.log("Errores de validación:", validate_errors);

        req.flash('error', 'Los datos del formulario son incorrectos.');
        for (var err in validate_errors) {
            req.flash('error', validate_errors[err]);
        };

        res.render('comments/new', {comment: comment,
                                    post: req.post,
                                    validate_errors: validate_errors});
        return;
    } 
    
    comment.save()
        .success(function() {
            req.flash('success', 'Comentario creado con éxito.');
            res.redirect('/posts/' + req.post.id );
        })
        .error(function(error) {
            next(error);
        });
};

// GET /posts/33/comments/66/edit
exports.edit = function(req, res, next) {

    res.render('comments/edit', {comment: req.comment,
                                 post: req.post
                                });
};

// PUT /posts/33/comments/66
exports.update = function(req, res, next) {
  
    req.comment.body = req.body.comment.body;
    
    var validate_errors = req.comment.validate();
    if (validate_errors) {
        console.log("Errores de validación:", validate_errors);

        req.flash('error', 'Los datos del formulario son incorrectos.');
        for (var err in validate_errors) {
            req.flash('error', validate_errors[err]);
        };

        res.render('comments/edit', {comment: req.comment,
                                     post: req.post,
                                     validate_errors: validate_errors});
        return;
    } 
    
    req.comment.save(['body'])
        .success(function() {
            req.flash('success', 'Commentario actualizado con éxito.');
            res.redirect('/posts/' + req.post.id );
        })
        .error(function(error) {
            next(error);
        });
};

// DELETE /posts/33/comments/66
exports.destroy = function(req, res, next) {

    req.comment.destroy()
        .success(function() {
            req.flash('success', 'Comentario eliminado con éxito.');
            res.redirect('/posts/' + req.post.id );
        })
        .error(function(error) {
            next(error);
        });
};

//-----------------------------------------------------------

// GET /orphancomments
exports.orphans = function(req, res, next) {

    models.Comment
        .findAll({order: 'postId',
                  include: [ {model: models.User, as: 'Author'},
                             {model: models.Post, as: 'Post'} ]})
        .success(function(comments) {

            console.log(comments);

            res.render('comments/orphans', {
                comments: comments
            });
        })
        .error(function(error) {
            next(error);
        });
};

//-----------------------------------------------------------

