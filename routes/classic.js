var express = require('express');
var router = express.Router();
var marked = require('marked');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
	var about = marked( fs.readFileSync(__dirname+'/../content/about-classic.md', 'utf8') );

	res.render('index', { 
		title: 'Matt Jiggins',
		content: about,
		layout: 'inside'
	});
});

module.exports = router;
