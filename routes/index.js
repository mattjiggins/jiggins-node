var express = require('express');
var router = express.Router();
var marked = require('marked');
var fs = require('fs');
var request = require('request');
var Q = require('q');
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
	function grabWelcome(){
		console.log("grabWelcome");
	    var deferred = Q.defer();		
		
		fs.readFile(__dirname+'/../content/welcome.md', 'utf8', function(err, data) {
		  if (err) throw err;
		  deferred.resolve( data );
		});
		return deferred.promise;
	}
	function grabProjects(){
		console.log("grabProjects");
	    var deferred = Q.defer();
		fs.readFile(__dirname+'/../content/home.json', 'utf8', function(err, data) {
		  if (err) throw err;
		  deferred.resolve( data );
		});
		return deferred.promise;
	}
	
	function grabTwitter() {
		console.log("grabTwitter");
	    var deferred = Q.defer();
		var requestURL = "http://"+req.headers.host+'/api/1/twitter';
	
		request(requestURL, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				deferred.resolve( body );
			}
		});
		return deferred.promise;
	}
	
	function grabPhotos() {
		console.log("grabPhotos");
	    var deferred = Q.defer();
		var requestURL = "http://"+req.headers.host+'/api/1/500px';
	
		request(requestURL, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				deferred.resolve( body );
			}
		});
		return deferred.promise;
	}
	
	
	Q.all([
		grabWelcome(),
		grabProjects(),
		grabTwitter(),
		grabPhotos()
	])
	.then(
		function(data) {
			var welcome = marked(data[0]);
			var json = JSON.parse(data[1]);
			var showcase = json.showcase;
			var projects = json.projects;
			
			var twitter = JSON.parse(data[2]);
			
			var thePhotos = JSON.parse(data[3]),
				photos = thePhotos.photos;
			
			res.render('index', {
				title: 'Hello',
				content: welcome,
				showcase: showcase,
				projects: projects,
				twitter: twitter,
				photos: photos,
				helpers: {
					marked: function (content) { return marked(content); }, //marked
					formatTweet: function(tweet,retweet) {
						// OK , when you retweet the char limit doesnt exist, so sometimes stuff gets cut - ie the urls - so this reconstructs a tweet
						if (retweet) {
							var users = tweet.match(/@\w+/g);
							var tweet = "RT "+users[0]+": "+retweet.text;
						}

						// Thanks to @rem for doing all the regex!
						// Borrowed from https://github.com/remy/twitterlib/blob/master/twitterlib.js
	
						var ify = function() {
						    return {
						      entities: function (t) {
						        return t.replace(/(&[a-z0-9]+;)/g, function (m) {
						          return ENTITIES[m];
						        });
						      },
						      link: function(t) {
						        return t.replace(/[a-z]+:\/\/([a-z0-9-_]+\.[a-z0-9-_:~\+#%&\?\/.=]+[^:\.,\)\s*$])/ig, function(m, link) {
						          return '<a title="' + m + '" href="' + m + '" target="_blank">' + ((link.length > 36) ? link.substr(0, 35) + '&hellip;' : link) + '</a>';
						        });
						      },
						      at: function(t) {
						        return t.replace(/(^|[^\w]+)\@([a-zA-Z0-9_]{1,15}(\/[a-zA-Z0-9-_]+)*)/g, function(m, m1, m2) {
						          return m1 + '<a href="http://twitter.com/' + m2 + '" target="_blank">@' + m2 + '</a>';
						        });
						      },
						      hash: function(t) {
						        return t.replace(/(^|[^&\w'"]+)\#([a-zA-Z0-9_^"^<]+)/g, function(m, m1, m2) {
						          return m.substr(-1) === '"' || m.substr(-1) == '<' ? m : m1 + '<a href="http://search.twitter.com/search?q=%23' + m2 + '" target="_blank">#' + m2 + '</a>';
						        });
						      },
						      clean: function(tweet) {
						        return this.hash(this.at(this.link(tweet)));
						      }
						    };
						  }();
	  
						  return ify.clean(tweet);
					}, //formatTweet
					dateFormat: function(tweetDate) {
						return moment(tweetDate, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').fromNow();
					}//dateFormat
				}
			});
		}
	)
	

});

module.exports = router;
