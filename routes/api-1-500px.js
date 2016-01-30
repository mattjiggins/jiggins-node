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
	api500.photos.getByUsername('mattjiggins',{sort:'taken_at',image_size:'200,440,1600'})
		.catch(console.error)
		.then(
			function(results) {
				var thePhotos = results.photos;
				var photos = []

				thePhotos.forEach(function(image){
					photos.push({
						id: image.id,
						name: image.name,
						taken_at: image.taken_at,
						description: image.description,
						url: image.url,
						width: image.width,
						height: image.height,
						img_200: image.images[0].url,
						img_440: image.images[1].url,
						img_1600: image.images[2].url
					})
				});
				
	            res.send(photos);
			});
});

module.exports = router;
