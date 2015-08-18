module.exports = function(app) 
{
	var HomeController = 
	{
		index: function(req,res) {	
			res.render('home/index', { session: req.session.user });
		},

		createPolitic: function(req, res) {
			res.render('home/shared/_createPoliticPartialView.ejs');
		},

		editPolitic: function(req, res) {
			res.render('home/shared/_editPoliticPartialView.ejs');
		},

		removePolitic: function(req, res) {
			res.render('home/shared/_deletePoliticPartialView.ejs');
		},

		tweetsModal: function(req, res){
			res.render('home/shared/_tweetsModalPartialView.ejs');
		},

		getTweetModalContent: function(req, res){
			res.render('home/shared/_tweetsModalPartialViewContent.ejs');
		}
	};
	return HomeController;
};

