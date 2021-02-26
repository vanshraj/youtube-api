var express = require('express');
var {google} = require('googleapis');
var router = express.Router();
const Video = require('../models/Videos.js');
const youtube = google.youtube('v3');

const vidparams = {
    key: 'AIzaSyCQWzExqPt9dEeABXjS2jmuHvjt04o_zNM',
    part: 'id, snippet, statistics, player',
    chart:'mostPopular',
    maxResult: 5,
}

//API TO ADD/UPDATE TRENDING VIDEOS
router.get('/add', function(req, res, next) {
  youtube.videos.list(vidparams, (err, results) => {//get trending videos

      results.data.items.forEach( (vid) => {//for each video get channel

        var item = vid.snippet;
        var stat = vid.statistics;
        var player = vid.player;
        var id = vid.id;
        var chanparams = {
          key: 'AIzaSyCQWzExqPt9dEeABXjS2jmuHvjt04o_zNM',
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
                'views': stat.viewCount,
                'likes': stat.likeCount,
                'dislikes': stat.dislikeCount,
                'subs' : chanstat.subscriberCount,
                'channel_thumb': chan.thumbnails,
                'channel_description': chan.description
            }

            Video.update({yid:id}, db_data,{upsert: true}, (err, r) => {
              if(err){
                console.log(err);
              }else{
                console.log('done');
              }
            });
          });
      });
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
    });
});

//API TO GET VIDEO
router.get('/', function(req, res, next) {
  Video.find({},(err, videos) => {
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

module.exports = router;
