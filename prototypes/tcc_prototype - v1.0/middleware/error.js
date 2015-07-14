exports.notFound = function(req, res, next) {
	res.status(404);
	res.render('error/not-found');
};

exports.serverError = function(error, req, res, next) {
	res.status(500);
	res.render('error/server-error', {error: error});
};
