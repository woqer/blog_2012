//Middleware que controla la caducidad de las sesiones

//var sessionController = require('./routes/session_controller.js');

module.exports = function() {
	return function (req, res, next) {
		if (req.session && req.session.user) {
			//console.log("******************\n Supera el req.session \n******************");
			var time = new Date().getTime();
		
			if (req.session.user.time < (time-60000)) {
				//Cerrar la sesión y notificar por flash
				delete req.session.user;
    			req.flash('info', 'La sesión ha caducado');
    			res.redirect("/login");
				console.log("¡¡¡Sesion caducada!!!");
			} else if (req.session.user) {
				//Actualizar el tiempo de sesion
				req.session.user.time = time;
				console.log("tiempo actualizado: 	" + time);
			}
		}
		next();
	}
}