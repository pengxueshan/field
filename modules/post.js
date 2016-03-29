var fs = require('fs');

function getPost(req, res){
    var postName = req.url.split('/')[2];
    var postPath = './posts/'+postName+'.md';
    fs.exists(postPath, function(ex){
        if(!ex){
            res.render('404', {
                title: '404'
            });
        }else{
            fs.readFile(postPath, function(err, data){
                if(err){
                    res.render('500', {
                        title: 'server error'
                    });
                }else{
                    res.render('post', {
                        title: postName,
                        post: data,
                        layout: 'post'
                    });
                }
            });
        }
    });
};

module.exports = {
    getPost: getPost
};