
var model = require('../models.js');


/*
*  Auto-loading con app.param
*/
exports.load = function(req, res, next, id) {

   model.Post
        .find({where: {id: Number(id)}})
        .success(function(post) {
            if (post) {
                req.post = post;
                next();
            } else {
                req.flash('error', 'No existe el post con id='+id+'.');
                next('No existe el post con id='+id+'.');
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
    
    if (req.session.user && req.session.user.id == req.post.authorId) {
        next();
    } else {
        console.log('Operación prohibida: El usuario logeado no es el autor del post.');
        res.send(403);
    }
};


//-----------------------------------------------------------

// GET /posts
exports.index = function(req, res, next) {

    model.Post
        .findAll({
            order: 'updatedAt DESC',
            include: ['User']
        })
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

    // Buscar el autor
    model.User
        .find({where: {id: req.post.authorId}})
        .success(function(user) {
            // Si encuentro al autor lo añado como el atributo user, sino añado {}.
            req.post.user = user || {};

            // Buscar comentarios
            model.Comment
                 .findAll({where: {postId: req.post.id},
                           order: 'updatedAt DESC',
                           include: ['User'] 
                 })
                 .success(function(comments) {
                    var new_comment = model.Comment.build({
                        body: 'Introduzca el texto del comentario'
                    });
                    res.render('posts/show', {
                        post: req.post,
                        comments: comments,
                        comment: new_comment
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
          authorId: req.session.user.id
        });
    
    var validate_errors = post.validate();
    if (validate_errors) {
        console.log("Errores de validación:", validate_errors);

        req.flash('error', 'Los datos del formulario son incorrectos.');
        for (var err in validate_errors) {
           req.flash('error', validate_errors[err]);
        };

        res.render('posts/new', {post: post,
                                 validate_errors: validate_errors});
        return;
    } 
    
    post.save()
        .success(function() {
            req.flash('success', 'Post creado con éxito.');
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
        console.log("Errores de validación:", validate_errors);

        req.flash('error', 'Los datos del formulario son incorrectos.');
        for (var err in validate_errors) {
            req.flash('error', validate_errors[err]);
        };

        res.render('posts/edit', {post: req.post,
                                  validate_errors: validate_errors});
        return;
    } 
    req.post.updateAttributes({ title: req.post.title,
                                body:  req.post.body })
        .success(function() {
            req.flash('success', 'Post actualizado con éxito.');
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
            req.flash('success', 'Post eliminado con éxito.');
            res.redirect('/posts');
        })
        .error(function(error) {
            next(error);
        });
};
