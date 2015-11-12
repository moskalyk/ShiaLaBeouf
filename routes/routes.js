
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async 	= require('async')

//ROUTES ===========================================================

module.exports = function (app){
	app.post('/count', function(req, res){
		var newCount = new Count({
			count: 1
		})
		newCount.save(function(err, message){
			if(err)
				res.send(500)
			else
				res.send(200)
		})
	})
	app.get('/quote/:number', function(req,res){
		Quote.findOne({'number': req.params.number}, function(err, quote){
			if(err)
				res.send(500)
			if(quote)
				res.send(quote.quote)
		})
	})
	app.post('/message', function(req,res){
		console.log(req.body.data)

		var newMessaage = new Message({
			message: req.body.data
		})
		newMessaage.save(function(err, message){
			if(err)
				res.send(500)
			else
				res.send(200)
		})
	})

	app.get('/messages', function(req,res){
		Message.find({},function(err,messages){
			if(err)
				res.send("Ooops, somthing went wrong.")
			else
				res.send(messages)
		})
	})

	app.get('/scrape', function(req, res){
		url = 'http://www.brainyquote.com/quotes/authors/s/shia_labeouf.html';

		var stack = []

		async.waterfall([
		function(callback) {

			    request(url, function(error, response, html){
			    	if(!error){
			        var $ = cheerio.load(html);
			        console.log($)
			        $('.masonryitem').filter(function(){

			            var data = $(this);
			            var el = data.text().split('\n')
			            
			           	stack.push(el[2])
			         
			        })
			        callback(null, stack);
			        	
			    	}
				})
			
		}], function (err, stack) {
			for (var i = 0; i < stack.length; i++) {
			           		
           		var newQuote = new Quote({
           			number: i,
           			quote: stack[i]
           		})
           		
           		newQuote.save(function(err, quotes){
           			// if(err)
           			// 	res.send(500)
           			// else
           			// 	res.send(200)
           		})
			};
			res.send(stack)
		});
	
	})

}

