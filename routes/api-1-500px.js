var express = require('express');
var router = express.Router();
var API500 = require('600px'),
	api500 = new API500({
		consumer_key: process.env.FIVEHUNDRED_CONSUMER_KEY,
		consumer_secret: process.env.FIVEHUNDRED_CONSUMER_SECRET,
		token: process.env.FIVEHUNDRED_TOKEN,
		token_secret: process.env.FIVEHUNDRED_TOKEN_SECRET		
	});

/* GET home page. */
router.get('/', function(req, res, next) {
	api500.photos.getByUsername('mattjiggins',{sort:'taken_at',image_size:'2'})
		.catch(console.error)
		.then(
			function(results) {
	            res.send(results);
			});
});

module.exports = router;
