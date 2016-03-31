var fs = require('fs');
var marked = require('marked');
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

function getList(){
    if(POSTS.length > 0){
        return POSTS.posts;
    }
    fs.readdir('./posts/', function(err, files){
        var len = files.length;
        if(len === 0) return POSTS;
        files.forEach(function(file){
            fs.stat('./posts/'+file, function(err, stats){
                if(err) throw err;
                if(stats.isFile()){
                    readPost(file.replace(/.md$/, ''));
                }
            });
        });
    });
}

function readPost(filename, cb){
    var postPath = './posts/'+filename+'.md';
    if(POSTS.length > 0){
        for(var i = 0; i < POSTS.length; i++){
            if(POSTS.posts[i].name === filename){
                return POSTS.posts[i];
            }
        }
    }
    console.log(filename);
    fs.exists(postPath, function(ex){
        if(!ex){
            if(cb) cb('404');
            return;
        }else{
            fs.readFile(postPath, 'utf8', function(err, data){
                if(err){
                    if(cb) cb('err');
                }else{
                    var postData = _compilePostData(filename, data);
                    // POSTS[filename] = postData;
                    POSTS.posts.push(postData);
                    POSTS.length = POSTS.length + 1;
                    if(cb) cb(null, postData);
                }
            });
        }
    });
};

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
    getPost: readPost,
    getList: getList
};