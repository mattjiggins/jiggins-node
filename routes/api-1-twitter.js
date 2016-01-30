var express = require('express');
var router = express.Router();
var Twitter = require('twitter');
 
var client = new Twitter({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

/* GET home page. */
router.get('/', function(req, res, next) {
	var params = {screen_name: 'mattjiggins'};
	client.get('statuses/user_timeline', params, function(error, tweets, response){
	  if (!error) {
		  res.send(tweets);
	  } else {
		  res.send(error);
	  }
	});
});

module.exports = router;
