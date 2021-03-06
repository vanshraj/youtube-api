var express = require('express');
var {google} = require('googleapis');
var router = express.Router();
const Video = require('../models/Videos.js');
const youtube = google.youtube('v3');

const vidparams = {
    key: process.env.API_KEY,
    part: 'id, snippet, statistics, player',
    chart:'mostPopular',
    maxResult: 5,
}

//API TO ADD/UPDATE TRENDING VIDEOS
router.get('/add', function(req, res, next) {
  youtube.videos.list(vidparams, (err, results) => {//get trending videos

      results.data.items.forEach( (vid, index) => {//for each video get channel

        var item = vid.snippet;
        var stat = vid.statistics;
        var player = vid.player;
        var id = vid.id;
        var chanparams = {
          key: process.env.API_KEY,
          part: 'snippet, statistics',
          id: item.channelId,
          maxResult: 1,
        }

        youtube.channels.list( chanparams, (err, channel) => {//store each result in db
            channel = channel.data.items[0];
            var chan = channel.snippet;
            var chanstat = channel.statistics;
            var db_data = {
                'yid' : id,
                'player':player.embedHtml,
                'title': item.title,
                'description': item.description,
                'thumbnails': item.thumbnails,
                'channelTitle' : item.channelTitle,
                'channelId' : item.channelId,
                'views': stat.viewCount?stat.viewCount:0,
                'likes': stat.likeCount?stat.likeCount:0,
                'dislikes': stat.dislikeCount?stat.dislikeCount:0,
                'subs' : chanstat.subscriberCount?chanstat.subscriberCount:0,
                'channel_thumb': chan.thumbnails,
                'channel_description': chan.description
            }

            Video.updateMany({yid:id}, db_data,{upsert: true}, (err, r) => {
                if(results.data.items.length-1 == index){//when all updated
                  if(err){
                      res.json({
                        status: "failed",
                        error: err
                      });
                  }else{
                    res.json({
                      status: "success",
                      updated: results.data.items.length
                    });
                  }
                }
            });
          });
      });
    });
});

//API TO GET VIDEO
router.get('/', function(req, res, next) {
  Video.find({}).sort({createdAt: -1}).exec((err, videos) => {
    if(err){
      res.json({
        status: "failed",
        error: err
      });
    } else{
      res.json({
        status: "success",
        size: videos.length,
        data: videos
      });
    }
  });
});

//API TO GET PARTICULAR VIDEO
router.get('/:yid', function(req, res, next) {
  Video.find({yid: req.params.yid},(err, video) => {
    if(err){
      res.json({
        status: "failed",
        error: err
      });
    } else{
      res.json({
        status: "success",
        data: (video.length>0) ? video[0]:null
      });
    }
  });
});

//API TO DELETE ALL VIDEOS
router.delete('/', function(req,res,next){
	Video.deleteMany({}, function(err){
		if(err){
			res.json({
				status: 'failed',
				error: err
			});
		}
		res.json({
			status: 'success',
			result: 'Successfuly Deleted'
		});
	});
});


module.exports = router;
