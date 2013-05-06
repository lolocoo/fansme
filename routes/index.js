/*
 * GET home page.
 */
require('../db');
var async = require('async');
var mongoose = require('mongoose');
var Star = mongoose.model('Star');
var Todo = mongoose.model('Todo');

exports.index = function (req, res) {
    // Star.find()
    //     .limit(100)
    //     .exec(function (err, stars) {
    //         res.render('index', {
    //             title: 'The Fans Me',
    //             stars: stars
    //         });
    //     });

    async.parallel({
        western : function(cb) {
            Star.find({ area : '欧美'}).limit(10).exec(cb);
        },
        e_males : function(cb) {
            Star.find({ career : '演员', gender: '男'}).limit(10).exec(cb);
        },
        e_females : function(cb) {
            Star.find({ career : '演员', gender: '女'}).limit(10).exec(cb);
        },
        s_males : function(cb) {
            Star.find({ career : '歌手', gender: '男'}).limit(10).exec(cb);
        },
        s_females : function(cb) {
            Star.find({ career : '歌手', gender: '女'}).limit(10).exec(cb);
        },
        models : function(cb) {
            Star.find({ career : '模特'}).limit(10).exec(cb);
        },

    },
    function(err, results){
        console.log(results.one);
        res.render('test', {
            title : 'The Fans Me - home',
            results : results
        });
    });
};
exports.add = function (req, res) {
    if (req.method === 'GET') {
        res.render('add', {
            title: 'add new star'
        });
    } else if (req.method === 'POST') {
        //res.redirect('/');
        new Star({
            nick_name: '苍井空',
            rate: 1
        }).save(function (err) {
                res.redirect('/');
            });
    }

};
exports.todos = function (req, res) {
    Star.find().limit(10).exec(function(err, stars){
        Todo.find(function(err ,todos){
            res.send([stars, todos]);
        });
    });
}
exports.delete = function (req, res) {
    //res.send(req.params.id);
    Star.remove({ _id: req.params.id}, function (err) {
        res.redirect('/');
    });
}
exports.stars = function (req, res) {
    Star.findOne({ name: req.params.name })
        .exec(function (err, star) {
            res.render('star', {
                title: req.params.name,
                star: star
            });
        });
}
exports.upload = function (req, res) {
    res.render('upload', {
        title: 'upload'
    });
}

exports.female = function(req, res) {
    Star.find({ gender: '女' })
        .skip(50*parseInt(req.query.p, 10))
        .limit(50)
        .exec(function(err, stars){
            console.log(req.params.type);
            res.render('female', {
                title : '全部女星',
                female_stars : stars,
                req : req
            });
        });
}
exports.listing = function (req, res) {
    async.parallel({
        western : function(cb) {
            Star.find({ area : '欧美'}).limit(10).exec(cb);
        },
        e_males : function(cb) {
            Star.find({ career : '演员', gender: '男'}).limit(10).exec(cb);
        },
        e_females : function(cb) {
            Star.find({ career : '演员', gender: '女'}).limit(10).exec(cb);
        },
        s_males : function(cb) {
            Star.find({ career : '歌手', gender: '男'}).limit(10).exec(cb);
        },
        s_females : function(cb) {
            Star.find({ career : '歌手', gender: '女'}).limit(10).exec(cb);
        },
        models : function(cb) {
            Star.find({ career : '模特'}).limit(10).exec(cb);
        },

    },
    function(err, results){
        console.log(results.one);
        res.render('test', {
            title : 'foo bar',
            results : results
        });
    });
}