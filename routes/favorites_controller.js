
var models = require('../models/models.js');


/*
*  Auto-loading con app.param
*/
//exports.load = function(req, res, next, id) {
//
//   models.Favorite
//        .find({where: {id: Number(id)}})
//        .success(function(favorite) {
//            if (favorite) {
//                req.favorite = favorite;
//                next();
//            } else {
//                req.flash('error', 'No existe el favorito con id='+id+'.');
//                next('No existe el favorito con id='+id+'.');
//            }
//        })
//        .error(function(error) {
//            next(error);
//        });
//};


//-----------------------------------------------------------

// GET /user/:userid/favoirites
exports.index = function(req, res, next) {

    var format = req.params.format || 'html';
    format = format.toLowerCase();
    var userId = req.session.user.id;

    models.Favorite
        .findAll({where:["userId like ?",userId]})
        .success(function(favorites) {

            models.Post
            .findAll({order: 'updatedAt DESC'})
            .success(function(posts) {

              models.Comment
              .findAll().succes(function(comments) {
                switch (format) { 
                  case 'html':
                  case 'htm':
                      res.render('favorites', {
                        posts: posts,
                        favorites : favorites
                      });
                      break;
                  case 'json':
                      res.send(posts);
                      break;
                  case 'xml':
                      res.send(posts_to_xml(posts));
                      break;
                  case 'txt':
                      res.send(posts.map(function(post) {
                          return post.title+' ('+post.body+')';
                      }).join('\n'));
                      break;
                  default:
                      console.log('No se soporta el formato \".'+format+'\" pedido para \"'+req.url+'\".');
                      res.send(406);
                }
              }).error.(function(error){
                next(error);
              });
            }).error(function(error) {
              next(error);
            });
        }).error(function(error) {
            next(error);
        });
};

// PUT  /users/:userid/favourites/:postid
exports.create = function(req, res, next) {

    var post = models.Post.build(
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

// DELETE  /users/:userid/favourites/:postid
exports.destroy = function(req, res, next) {

    var Sequelize = require('sequelize');
    var chainer = new Sequelize.Utils.QueryChainer

    // Obtener los comentarios
    req.post.getComments()
       .success(function(comments) {
           for (var i in comments) {
                // Eliminar un comentario
                chainer.add(comments[i].destroy());
           }

           // Eliminar el post
           chainer.add(req.post.destroy());

           // Ejecutar el chainer
           chainer.run()
            .success(function(){
                 req.flash('success', 'Post (y sus comentarios) eliminado con éxito.');
                 res.redirect('/posts');
            })
            .error(function(errors){
                next(errors[0]);   
            })
       })
       .error(function(error) {
           next(error);
       });
};

function quita_espacios(text) {
     var resultado = "%"+text.replace(/\s/g, '%')+"%";
     return resultado;
}

// GET /posts/search
exports.search = function(req, res, next) {

    var format = req.params.format || 'html';
    var texto = req.param('search') || ' ';
    format = format.toLowerCase();
    texto = quita_espacios(texto);

    models.Post
        .findAll({where:["title like ? OR body like ?",texto,texto],
                  order:"updatedAt DESC",
                  include: [ { model: models.User, as: 'Author' } ]
        })
        .success(function(posts) {
          
          models.Comment
          .findAll().success(function(comments) {
          
            switch (format) { 
              case 'html':
              case 'htm':
                  res.render('posts/index', {
                    posts: posts,
                    comments: comments
                  });
                  break;
              case 'json':
                  res.send(posts);
                  break;
              case 'xml':
                  res.send(posts_to_xml(posts));
                  break;
              case 'txt':
                  res.send(posts.map(function(post) {
                      return post.title+' ('+post.body+')';
                  }).join('\n'));
                  break;
              default:
                  console.log('No se soporta el formato \".'+format+'\" pedido para \"'+req.url+'\".');
                  res.send(406);
            }

          })
          .error(function(error) {
            next(error);
          });
        })
        .error(function(error) {
            console.log("Error: No puedo listar los posts.");
            res.redirect('/');
        });
};
