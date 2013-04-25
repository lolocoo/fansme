var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://roc:8233375@widmore.mongohq.com:10000/stars');

var StarSchema = new Schema({
    id :          { type : Number },
    img :         { type : String },
    name :        { type : String },
    nick_name :   { type : String },
    gender :      { type : String },
    career :      { type : String },
    nationality : { type : String },
    area :        { type : String },
    birth :       { type : String },
    astrology :   { type : String },
    height :      { type : String },
    weight :      { type : String },
    blood :       { type : String },
    d3 :          { type : String },
    rate :        { type : Number, default: 0 }
});

var TodoSchema = new Schema({
    title : { type : String }
});

mongoose.model('Star', StarSchema);
mongoose.model('Todo', TodoSchema);