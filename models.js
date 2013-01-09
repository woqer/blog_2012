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


// Exportar la clase creada:
exports.Post = Post;
