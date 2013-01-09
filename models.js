// Modelos ORM

var Sequelize = require('sequelize');

// Para usar MySQL:
// var sequelize = new Sequelize('blog', 'core', 'core');

// Para usar SQLite:
// var sequelize = new Sequelize(null, null, null, 
//			      {dialect: "sqlite",
//			       storage: "blog.sqlite"});

// Usar BBDD definida en variables de entorno:
var sequelize = new Sequelize(process.env.DATABASE_NAME, 
                              process.env.DATABASE_USER, 
                              process.env.DATABASE_PASSWORD, 
			      { dialect: process.env.DATABASE_DIALECT, 
                                protocol: process.env.DATABASE_PROTOCOL, 
                                port: process.env.DATABASE_PORT,
			        host: process.env.DATABASE_HOST,
			        storage: process.env.DATABASE_STORAGE,
                                omitNull: true});

// Campos de los posts.
var Post = sequelize.define('Post',
            { authorId: {
                 type: Sequelize.INTEGER,
                 validate: {
                     notEmpty: {msg: "El campo autor no puede estar vacio"}}
              },
              title: {
                 type: Sequelize.STRING,
                 validate: {
                     notEmpty: {msg: "El campo del titulo no puede estar vacio"}}
              },
              body: {
                 type: Sequelize.TEXT,
                 validate: {
                     notEmpty: {msg: "El cuerpo del post no puede estar vacio"}}
              }
            });

// Campos de los Usuarios.
var User = sequelize.define(
    'User',
    { 
        login: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: { msg: "El campo login no puede estar vacio" }
            }
        },
        name: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: { msg: "El campo nombre no puede estar vacio" }
            }
        },
        email: {
            type: Sequelize.TEXT,
            validate: {
                isEmail: { msg: "El formato del email introducido no es correcto" },
                notEmpty: { msg: "El campo email no puede estar vacio" }
            }
        },
        hashed_password: {
            type: Sequelize.STRING
        },
        salt: {
            type: Sequelize.STRING
        }
        
    });


// Campos de los Comentarios.
var Comment = sequelize.define(
    'Comment',
    { 
        authorId: {
            type: Sequelize.INTEGER,
            validate: {
                notEmpty: { msg: "El campo authorId no puede estar vacío" }
            }
        },
        postId: {
            type: Sequelize.INTEGER,
            validate: {
                notEmpty: { msg: "El campo postId no puede estar vacío" }
            }
        },
        body: {
            type: Sequelize.TEXT,
            validate: {
                notEmpty: { msg: "El cuerpo del comentario no puede estar vacío" }
            }
        }
    });


// Relaciones

// La llamada User.hasMany(Post); 
//  - crea un atributo llamado userId en el modelo de Post  
//  - y en el prototipo de User se crean los metodos getPosts, setPosts,
//    addPost, removePost, hasPost y hasPosts.
// 
// Como el atributo del modelo Post que apunta a User se llama authorId 
// en vez de userId, he añadido una opcion que lo indica.
User.hasMany(Post, {foreignKey: 'authorId'});
User.hasMany(Comment, {foreignKey: 'authorId'});
Post.hasMany(Comment, {foreignKey: 'postId'});

// La llamada Post.belongsTo(User);
//  - crea en el modelo de Post un atributo llamado userId,
//  - y en el prototipo de Post se crean los metodos getUser y setUser.
//
// Como el atributo del modelo Post que apunta a User se llama authorId 
// en vez de userId, he añadido una opcion que lo indica. Asi la 
// foreignkey del modelo Post es authorId, y los metodos creados son 
// setAuthor y getAuthor. 
Post.belongsTo(User, {as: 'Author', foreignKey: 'authorId'});
Comment.belongsTo(User, {as: 'Author', foreignKey: 'authorId'});
Comment.belongsTo(Post, {as: 'Post', foreignKey: 'postId'});


// Exportar la clase creada:
exports.Post = Post;
exports.User = User;
exports.Comment = Comment;

