exports.getCount = function () {
	var cont = 0;
	return function (req, res, next) {
			cont++;
			vista = "Visitas: "+cont;
			res.locals.visitas = vista ;
			console.log(vista);
			next();
		}
}