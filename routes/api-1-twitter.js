var express = require('express');
var router = express.Router();
var Twitter = require('twitter');
 
var client = new Twitter({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var Cacheman = require('cacheman');
var cacheTweets = new Cacheman({ ttl: 600 }); // 10 minutes

/* GET home page. */
router.get('/', function(req, res, next) {
	
	cacheTweets.get('tweets', function (err, data) {		
		if (err) throw err;

		if(! data){
			// There is no data, do this function which will check for perm cache etc
			var params = {screen_name: 'mattjiggins'};
			client.get('statuses/user_timeline', params, function(error, tweets, response){
			  if (!error) {
				  cacheTweets.set ('tweets', tweets);
				  res.send(tweets);
			  } else {
				  res.send(error);
			  }
			});
			
		} else {
			// Use the data we have.
			res.send( data );
		};
	});
	

});

module.exports = router;
