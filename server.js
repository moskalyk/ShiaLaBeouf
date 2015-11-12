
var express 		= require('express'),
	app 			= express(),
	helmet			= require('helmet'),
	logger 			= require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser 		= require('body-parser'),
	compression		= require('compression'),
	port 			= process.env.PORT || 3000,
	methodOverride 	= require('method-override');
	db 				= require('mongoose') //shhh this is global for our schemas
  var io = require('socket.io').listen(app.listen(port));

// var ig = require('instagram-node').instagram()
// ig.use({ client_id: 'f116eaf1b709496bad1b8d7a6f9e5f6d', client_secret: 'a295efad76f04d72985edbe5f4f283a2' });


var colors  = require('colors');

// var Instagram = require('instagram-node-lib');
var http = require('http');
var request = ('request');
// var secrets = require('./config/credentials.json');

//INSTAGRAM CONFIGS =================================
// Instagram.set('client_id', secrets.client);
// Instagram.set('client_secret', secrets.client_secret);
// Instagram.set('callback_url', 'http://localhost:1330/callback');
// Instagram.set('redirect_uri', 'http://localhost:1330');
// Instagram.set('maxSockets', 10);

// Instagram.subscriptions.subscribe({
//   object: 'geography',
//   lat: 43.70937727,
//   lng: -79.36991215,
//   radius: 5000,
//   aspect: 'media',
//   callback_url: 'http://localhost:1330/callback',
//   type: 'subscription',
//   id: '#'
// });

io.on('connection', function (socket) {
  console.log('Socket Connected')
  // socket.emit('news', { 'data': 'world' });
  // socket.on('my other event', function (data) {
  //   console.log(data);
  // })

  socket.on("news", function(data){
    console.log(JSON.stringify(data))
    socket.broadcast.emit('news', data)
    // socket.emit('news', data)
  })

})

// Instagram.subscriptions.subscribe({ lat: 43.70937727, lng: -79.36991215, radius: 1000 });

// io.configure(function () {
//   io.set("transports", [
//     'websocket'
//     , 'xhr-polling'
//     , 'flashsocket'
//     , 'htmlfile'
//     , 'jsonp-polling'
//   ]);
//   io.set("polling duration", 10);
// });

// app.get('/location', function(req,res){
//   // ig.location_search({ lat: 43.7097990, lng:-79.3687330}, function(err, result, remaining, limit) {
//   //   res.send(result)
//   // });
//   // ig.location_media_recent('661601706', function(err, result, pagination, remaining, limit) {
//   //   res.send(result)
//   // });

//   ig.media_search(43.7097990, -79.3687330, function(err, medias, remaining, limit) {
//     res.send(medias)
//   })
// })

// app.get('/instagram', function(req, res){
//   //user_id: 2110323220

//   ig.user_media_recent('2110323220', function(err, medias, pagination, remaining, limit){
//     res.send(medias)
//   })
// })

// app.get('/callback', function(req,res){
// 	console.log('nice to meet you')
// 	var handshake =  Instagram.subscriptions.handshake(req, res);
// })

// app.post('/callback', function(req, res) {
//     console.log('posting the callback')

//     ig.user_media_recent('2110323220', function(err, medias, pagination, remaining, limit){
//       medias['thing1'] = 'this worked'
//       io.sockets.emit('instagram', medias)
//       // res.send(medias)
//     })

//     // ig.user_media_recent('2110323220', function(err, medias, pagination, remaining, limit){
//     //   medias['thing2'] = 'no, this worked'
//     //   io.sockets.broadcast.emit('instagram', medias)
//     //   res.send(medias)
//     // })

//     res.end();
// });

function emit(packet) {
  io.sockets.emit('instagram', packet);
}

// DATBASE CONFIGS ===================================
db.connect('mongodb://morgan:password@ds053964.mongolab.com:53964/shia', function(err, db) {
    if (err) throw err;
    console.log("Connected to Database");
    _db = db 
})

// EXPRESS CONFIGS ===================================
app.use(compression())
app.use(helmet())
app.use(logger('dev'))
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use('/controllers',express.static(__dirname, 'public/controllers'));
app.use(cookieParser()); 


//BROWSER =============================================
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// SCHEMAS ============================================
require('./db/messageSchema.js')
require('./db/quoteSchema.js')
require('./db/countSchema.js')

// MODELS =============================================
Message = db.model('Messsage', messageSchema)
Quote = db.model('Quote', quoteSchema)
Count = db.model('Count', countSchema)

//ROUTES ==============================================
require('./routes/routes.js')(app); 

//LISTEN ==============================================
// app.listen(port);

console.log('The magic happens on port ' + port)