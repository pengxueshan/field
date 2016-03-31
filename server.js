// leancloud 云引擎初始化
var AV = require('leanengine');
var APP_ID = process.env.LC_APP_ID;
var APP_KEY = process.env.LC_APP_KEY;
var MASTER_KEY = process.env.LC_APP_MASTER_KEY;
AV.initialize(APP_ID, APP_KEY, MASTER_KEY);

// import {getPost} from './modules/post';
var Post = require('./modules/post');

var Util = require('./modules/util');

// 加载express框架
var express = require('express');
// 加载handlebars模板引擎
var exphbs  = require('express-handlebars');

// 创建app
var app = express();
// leancloud云引擎中间件
app.use(AV.Cloud);
// 设置应用的模板引擎
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
// 设置静态文件目录，此目录下的文件将不做处理，直接发送给客户端
app.use(express.static(__dirname + '/public'));

// 首页路由
app.get('/', (req,res) => {
    res.render('home', {
        title: 'Home',
        list: Post.getList(),
        helpers: {
            transMonth: function(m){
                return Util.getMonth(m);
            }
        }
    });
});
// 文章详情路由
app.get('/post/*', function(req, res){
    Post.getPost(req.url.split('/')[2], function(err, data){
        if(err){
            if(err === '404'){
                res.render('404', {
                    title: '404'
                });
            }else if(err === 'err'){
                res.render('500', {
                    title: 'server error'
                });
            }
        }else{
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
    });
});

app.listen(1024, () => {console.log('Express app listening on port 1024');});