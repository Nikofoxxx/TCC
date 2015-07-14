module.exports = function(app) 
{
	var HomeController = 
	{
		index: function(req,res) {		
			res.render('home/index');
		},

		editPolitic: function(req, res) {
			res.render('home/shared/_editPoliticPartialView.ejs');
		}		
	};
	return HomeController;
};
