//Middleware que controla la caducidad de las sesiones

var sessionController = require('./routes/session_controller.js');

function (req, res, next) {
	var time = new Date().getTime();

	if (req.session.user.time < (time-60000)) {
		//Cerrar la sesión y notificar por flash
		sessionController.destroy;
	} else {
		//Actualizar el tiempo de sesion
		req.session.user.time = time;
	}
}