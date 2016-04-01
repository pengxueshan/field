var fs = require('fs');
var marked = require('marked');
var Util = require('../modules/util');
marked.setOptions({
    highlight: function (code) {
        return require('highlight.js').highlightAuto(code).value;
    },
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true
});
// post缓存
var POSTS = {
    length: 0,
    posts: []
};

function renderIndex(req, res){
    if(POSTS.length < 1){
        fs.readdir('./posts/', function(err, files){
            var len = files.length;
            if(len === 0) return POSTS;
            files.forEach(function(file){
                fs.stat('./posts/'+file, function(err, stats){
                    if(err) throw err;
                    if(stats.isFile()){
                        fs.readFile('./posts/'+file, 'utf8', function(err, data){
                            if(err){
                                _render500(req, res);
                            }else{
                                var postData = _compilePostData(file.replace(/.md/, ''), data);
                                POSTS.posts.push(postData);
                                POSTS.length = POSTS.length + 1;
                                if(--len === 0){
                                    _renderHome(req, res);
                                }
                            }
                        });
                    }
                });
            });
        });
    }else{
        _renderHome(req, res);
    }
}

function renderPost(req, res){
    var filename = req.url.split('/')[2];
    var postPath = './posts/' + filename + '.md';
    if(POSTS.length > 0){
        for(var i = 0; i < POSTS.length; i++){
            if(POSTS.posts[i].name === filename){
                _renderPost(req, res, POSTS.posts[i]);
                return;
            }else{
                _readFile(req, res, postPath);
            }
        }
    }else{
        _readFile(req, res, postPath);
    }
}

function _renderHome(req, res){
    res.render('home', {
        title: 'Home',
        list: POSTS.posts,
        helpers: {
            transMonth: function(m){
                return Util.getMonth(m);
            }
        }
    });
}

function _render500(req, res){
    res.render('500', {
        title: 'server error'
    });
}

function _render404(req, res){
    res.render('404', {
        title: '404'
    });
}

function _renderPost(req, res, data){
    res.render('post', {
        title: data.title,
        post: data.content,
        year: data.year,
        month: data.month,
        day: data.day,
        helpers: {
            transMonth: function(m){
                return Util.getMonth(m);
            }
        }
    });
}

function _readFile(req, res, postPath){
    fs.exists(postPath, function(ex){
        if(!ex){
            _render404(req, res);
        }else{
            fs.readFile(postPath, 'utf8', function(err, data){
                if(err){
                    _render500(req, res);
                }else{
                    var postData = _compilePostData(filename, data);
                    POSTS.posts.push(postData);
                    POSTS.length = POSTS.length + 1;
                    _renderPost(req, res, postData);
                }
            });
        }
    });
}

function _compilePostData(filename, data){
    var info = filename.split('_');
    return {
        name: filename,
        year: info[0],
        month: info[1],
        day: info[2],
        title: info[3],
        content: marked(data)
    };
}

module.exports = {
    renderPost: renderPost,
    renderIndex: renderIndex
};