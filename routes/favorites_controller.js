
var models = require('../models/models.js');


/*
*  Auto-loading con app.param
*/
exports.load = function(req, res, next, id) {
    var separador = '======> ';
    console.log (separador + 'favoriteController.load cargado');
   models.Favorite
        .find({where: {postId: Number(id)}})
        .success(function(favorite) {
            console.log (separador + 'success del Favorite find');
            if (favorite) {
                console.log (separador + 'if(favorite) funciona: ' + favorite);
                req.favorite = favorite;
                next();
            } else {
                console.log (separador + 'favorite no encontrado, salta el else');
                //req.flash('error', 'No existe el favorito con postId='+id+'.');
                next();
            }
        })
        .error(function(error) {
            next(error);
        });
};


//-----------------------------------------------------------

// GET /user/:userid/favoirites
exports.index = function(req, res, next) {

    var format = req.params.format || 'html';
    format = format.toLowerCase();

    models.Favorite
        .findAll({where: {userId: req.user.id}})
        .success(function(favorites) {

            models.Post
            .findAll({order: 'updatedAt DESC',
                      include: [ { model: models.User, as: 'Author' } ]
            })
            .success(function(posts) {

              models.Comment
              .findAll().success(function(comments) {
                switch (format) { 
                  case 'html':
                  case 'htm':
                      res.render('favorites', {
                        posts: posts,
                        favorites: favorites,
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
              }).error(function(error){
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
    console.log('======> se entra en favorite.create');
    var favorite = models.Favorite.build(
        { userId: req.session.user.id,
          postId: req.post.id
        });
    
    var validate_errors = favorite.validate();
    if (validate_errors) {
        console.log("Errores de validación:", validate_errors);

        req.flash('error', 'Los datos del formulario son incorrectos.');
        for (var err in validate_errors) {
           req.flash('error', validate_errors[err]);
        };

        res.render('posts/show', {favorite: favorite,
                                 validate_errors: validate_errors});
        return;
    } 
    
    favorite.save()
        .success(function() {
            req.flash('success', 'Post agregado a favoritos.');
            res.redirect('/posts');
        })
        .error(function(error) {
            next(error);
        });
};

// DELETE  /users/:userid/favourites/:postid
exports.destroy = function(req, res, next) {
    
    console.log('======> entro en DESTROY');
    var Sequelize = require('sequelize');
    var chainer = new Sequelize.Utils.QueryChainer

    chainer.add(req.favorite.destroy());

     // Ejecutar el chainer
     chainer.run()
      .success(function(){
           req.flash('success', 'Post eliminado de favoritos.');
           res.redirect('/posts');
      })
      .error(function(errors){
          next(errors[0]);   
      })
      
};

// function quita_espacios(text) {
//      var resultado = "%"+text.replace(/\s/g, '%')+"%";
//      return resultado;
// }

// // GET /posts/search
// exports.search = function(req, res, next) {

//     var format = req.params.format || 'html';
//     var texto = req.param('search') || ' ';
//     format = format.toLowerCase();
//     texto = quita_espacios(texto);

//     models.Post
//         .findAll({where:["title like ? OR body like ?",texto,texto],
//                   order:"updatedAt DESC",
//                   include: [ { model: models.User, as: 'Author' } ]
//         })
//         .success(function(posts) {
          
//           models.Comment
//           .findAll().success(function(comments) {
          
//             switch (format) { 
//               case 'html':
//               case 'htm':
//                   res.render('posts/index', {
//                     posts: posts,
//                     comments: comments
//                   });
//                   break;
//               case 'json':
//                   res.send(posts);
//                   break;
//               case 'xml':
//                   res.send(posts_to_xml(posts));
//                   break;
//               case 'txt':
//                   res.send(posts.map(function(post) {
//                       return post.title+' ('+post.body+')';
//                   }).join('\n'));
//                   break;
//               default:
//                   console.log('No se soporta el formato \".'+format+'\" pedido para \"'+req.url+'\".');
//                   res.send(406);
//             }

//           })
//           .error(function(error) {
//             next(error);
//           });
//         })
//         .error(function(error) {
//             console.log("Error: No puedo listar los posts.");
//             res.redirect('/');
//         });
// };
