var fs = require('fs');
var marked = require('marked');
marked.setOptions({
    highlight: function (code) {
        return require('highlight.js').highlightAuto(code).value;
    }
});
// post缓存
var POSTS = {
    length: 0
};

function getList(){
    if(POSTS.length > 0){
        return POSTS;
    }
    fs.readdir('./posts/', function(err, files){
        var len = files.length;
        if(len === 0) return POSTS;
        files.forEach(function(file){
            fs.stat('./posts/'+file, function(err, stats){
                if(err) throw err;
                if(stats.isFile()){
                    readPost(file);
                    return POSTS;
                }
            });
        });
    });
}

function readPost(filename, cb){
    var postPath = './posts/'+filename+'.md';
    fs.exists(postPath, function(ex){
        if(!ex){
            cb('404');
            return;
        }else{
            fs.readFile(postPath, 'utf8', function(err, data){
                if(err){
                    cb('err');
                }else{
                    var postData = _compilePostData(filename, data);
                    POSTS[filename] = postData;
                    POSTS.length = POSTS.length + 1;
                    cb(null, postData);
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