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
app.get('/', Post.renderIndex);
// 文章详情路由
app.get('/post/*', Post.renderPost);

app.listen(3000, function(){console.log('Express app listening on port 1024');});