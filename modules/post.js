var fs = require('fs');
var marked = require('marked');
// post缓存
var POSTS = {
    length: 0
};

// function getPost(req, res){
//     var postName = req.url.split('/')[2];
//     var postPath = './posts/'+postName+'.md';
//     if(POSTS[postName]){
//         return POSTS[postName];
//     }
//     var result = _readPost(postPath);
//     if(result === '404'){
//         res.render('404', {
//             title: '404'
//         });
//     }else if(result === 'err'){
//         res.render('500', {
//             title: 'server error'
//         });
//     }else{
//         res.render('post', {
//             title: result.title,
//             post: result.content,
//             year: result.year,
//             month: result.month,
//             day: result.day
//         });
//     }
// };

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
                    _readPost(file);
                    return POSTS;
                }
            });
        });
    });
}

function _readPost(filename, cb){
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
    getPost: _readPost,
    getList: getList
};