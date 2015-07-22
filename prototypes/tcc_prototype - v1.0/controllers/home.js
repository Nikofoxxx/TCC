module.exports = function(app) 
{
	var HomeController = 
	{
		index: function(req,res) {		
			res.render('home/index');
		},

		createPolitic: function(req, res) {
			res.render('home/shared/_createPoliticPartialView.ejs');
		},

		editPolitic: function(req, res) {
			res.render('home/shared/_editPoliticPartialView.ejs');
		},

		removePolitic: function(req, res) {
			res.render('home/shared/_deletePoliticPartialView.ejs');
		}
	};
	return HomeController;
};

