//faz carregamento dos require..
var express = require('express')
	, app = express() //express
	, load = require('express-load') //express load para organizar os codigos em pasta
	, error = require('./middleware/error') //logica de verificação de erros
	, mongoose = require('mongoose')
	, server = require('http').createServer(app) //cria um servidor http passando o gerado pelo express
	, io = require('socket.io').listen(server)//cria o io em cima do server http
	, MemoryStore = require('connect/middleware/session/memory')
	, session_store = new MemoryStore()
	, connect = require('connect');


//configurar o acesso ao banco
global.db = mongoose.connect('mongodb://localhost/database',function(error){
	if (error) { 
		console.log(error); 
	} else {
		console.log("Conectado ao Banco de Dados!");
	}
});

//seta o caminho das views
app.set('views', __dirname + '/views');
//seta a view engine como ejs..
app.set('view engine', 'ejs');

//habilita os cookies, session, urlencoder, override e uso das rotas
app.use(express.cookieParser('ntalk'));
app.use(express.session({store: session_store}));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

//caminho da area publica site..
app.use(express.static(__dirname + '/public'));

//chamda das paginas de erro..
app.use(error.notFound);
app.use(error.serverError);

//carrega as pastas de models, controls, e rotas.. e insere no servidor
load('models')
    .then('services')
    .then('controllers')
    .then('routes')    
    .into(app);

server.listen(3000, function(){
    console.log('Politistatus Online!');
});

var SNData = app.controllers.socialNetworksData;

io.on('connection', function (client) {
	var cookie_string = client.request.headers.cookie;
	var parsed_cookies = connect.utils.parseCookie(cookie_string);
	var connect_sid = parsed_cookies['connect.sid'];
	var sid = connect_sid.substr(2, connect_sid.indexOf(".") - 2);

	if (connect_sid) {
		session_store.get(sid, function (error, session) {
			console.log('Cliente conectado!');
			SNData.getUpdatedComments(client, session.user.userName);
		});
	}
});
