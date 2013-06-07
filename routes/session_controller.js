
var util = require('util');


// Middleware: Login is required:
//
// Si el usuario ya hizo login anteriormente entonces existira 
// el objeto user en req.session, por lo que continuo con los demas 
// middlewares o rutas.
// Si no existe req.session.user, entonces es que aun no he hecho 
// login, por lo que me redireccionan a una pantalla de login. 
// Guardo cual es mi url para volver automaticamente a esa url 
// despues de hacer rlogin. 
//
exports.requiresLogin = function (req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login?redir=' + req.url);
    }
};



// Formulario para hacer login
//
// Es la tipica ruta REST que devuelve un formulario para crear 
// un nuevo recurso.
// Paso como parametro el valor de redir (es una url a la que 
// redirigirme despues de hacer login) que me han puesto en la 
// query (si no existe uso /).
//
exports.new = function(req, res) {

    res.render('session/new', 
               { redir: req.query.redir || '/'
               });
};


// Crear session, es decir, hacer el login.
//
// El formulario mostrado por /login usa como action este metodo.
// Cojo los parametros que se han metido en el formulario y hago 
// login con ellos, es decir crea la session.
// Uso el metodo autenticar exportado por user_controller para 
// comprobar los datos introducidos.
// Si la autenticacion falla, me redirijo otra vez al formulario 
// de login.
// Notar que el valor de redir lo arrastro siempre. 
exports.create = function(req, res) {

    var redir = req.body.redir || '/'

    console.log('REDIR = ' + redir);

    var login = req.body.login;
    var password  = req.body.password;

    console.log('Login    = ' + login);
    console.log('Password = ' + password);

    var time = new Date().getTime();

    console.log('Time     = ' + time + '');

    require('./user_controller').autenticar(login, password, function(error, user) {

        if (error) {
            if (util.isError(error)) {
                next(error);
            } else {
                req.flash('error', 'Se ha producido un error: '+error);
                res.redirect("/login?redir="+redir);        
            }
            return;
        }

        // IMPORTANTE: creo req.session.user.
        // Solo guardo algunos campos del usuario en la sesion.
        // Esto es lo que uso para saber si he hecho login o no.
        req.session.user = {id:user.id
                            , login:user.login
                            , name:user.name
                            , time:time};

        // Vuelvo al url indicado en redir
        res.redirect(redir);
    });
}; 


// Logout
// 
// Para salir de la session simplemente destruyo req.session.user
//
exports.destroy = function(req, res) {

    delete req.session.user;
    req.flash('success', 'Logout.');
    res.redirect("/login");     
};


