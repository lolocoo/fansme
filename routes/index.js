/*
 * GET home page.
 */
require('../db');
var 
    async = require('async'),
    mongoose = require('mongoose'),
    Star = mongoose.model('Star'),
    Todo = mongoose.model('Todo'),
    Product = mongoose.model('Product'),
    check = require('validator').check,
    sanitize = require('validator').sanitize;

exports.index = function (req, res) {
    async.parallel({
        western : function(cb) {
            Star.find({ area : '欧美'}).limit(10).exec(function(err, stars){
                stars.forEach(function(elm, index){
                    console.log(index);
                });
            });
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
        }
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
};

exports.delete = function (req, res) {
    //res.send(req.params.id);
    Star.remove({ _id: req.params.id }, function (err) {
        res.redirect('/');
    });
};

exports.stars = function (req, res) {
    Star.findOne({ name: req.params.name })
        .exec(function (err, star) {
            res.render('star', {
                title: req.params.name,
                star: star
            });
        });
};

exports.upload = function (req, res) {
    res.render('upload', {
        title: 'upload'
    });
};

exports.star_cate = function(req, res) {
    var opt = {} , typename;

    switch(req.params.type){
        case 'female':
            opt = {gender: '女'};
            typename = "女";
            break;
        case 'male':
            opt = {gender: '男'};
            typename = "男";
            break;
        case 'hk':
            opt = {area: '港台'};
            typename = "港台";
            break;
        case 'eur':
            opt = {area: '欧美'};
            typename = "欧美";
            break;
        case 'china':
            opt = {nationality: '中国'};
            typename = "中国";
            break;
    }

    Star.find(opt)
        .skip(50*parseInt(req.query.p, 10))
        .limit(50)
        .exec(function(err, stars){
            console.log(req.params.type);
            res.render('star_paging', {
                title : typename+'明星',
                stars : stars,
                req : req,
                opt : opt
            });
        });
};

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
};

exports.product_listing = function(req, res){
    Product.find()
    .exec(function(err, docs){
        res.render('product_listing', {
            title: 'product listing',
            products : docs
        });
    });
};

exports.products = function(req, res){
    Product.findOne({ _id: req.query.q })
    .exec(function(err, doc){
        console.log(doc);
        res.render('product', {
            title: 'product detail',
            product: doc
        });
    });
};

exports.show_product_upload = function(req, res){
    res.render('product_upload', {
        title : '上传商品'
    });
};

exports.product_delete = function(req, res){
    Product.remove({ _id: req.params.id }, function(err){
        res.redirect('/product_listing');
    });
};

exports.product_edit = function(req, res) {
    Product.findOne({ _id: req.params.id })
           .exec(function(err, docs){
                res.render('product_edit', {
                    title: '编辑商品',
                    product: docs
                });
           });
}
exports.product_update = function(req, res) {
    var stars = sanitize(req.body.p_star).trim().split(',');
    console.log(stars);
    Product.update({ _id: req.body.pid},{
        "$set" :{
            name       : req.body.p_name,
            img_url    : req.body.p_img_url,
            taobao_url : req.body.p_taobao_url,
            star       : stars,
            desc       : req.body.p_desc
        }
    },
    function(err){
        res.redirect('/product/?q='+req.body.pid);
    });
}

exports.product_upload = function(req, res){
    new Product({
        name       : req.body.p_name,
        img_url    : req.body.p_img_url,
        taobao_url : req.body.p_taobao_url,
        star       : req.body.p_star,
        desc       : req.body.p_desc
    }).save(function(err){
        res.redirect('/product_listing');
    });
};