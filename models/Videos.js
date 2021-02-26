const mongoose = require('mongoose');

var UrlSchema = new mongoose.Schema({
	url : { type: String },
	width : { type: Number },
	height: { type: Number }
});
// Video Schema
var VideoSchema = mongoose.Schema({
	yid : { type: String, required : true, unique: true },
	player:{ type: String, required : true },
	title: { type : String, required : true },
	description : { type : String, required : true },
	thumbnails : {
		default : { type: UrlSchema },
		medium : { type: UrlSchema },
		high : { type: UrlSchema },
		standard : { type: UrlSchema },
		maxres : { type: UrlSchema }
	},
	channelTitle : { type : String, required : true },
	channelId : { type : String, required : true },
	views : { type : Number, required : true },
	likes : { type : Number, required : true },
	dislikes : { type : Number, required : true },
	subs : { type : Number, required : true },
	channel_thumb : {
		default : { type: UrlSchema },
		medium : { type: UrlSchema },
		high : { type: UrlSchema }
	},
	channel_description: { type : String, required : true }
});

var Video = mongoose.model('Video', VideoSchema);

module.exports = Video;
