const Koa = require('koa')
const router = require('koa-router')()
const render = require('koa-art-template')
const path = require('path')
const static = require('koa-static')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const sd = require('silly-datetime')
const jsonp = require('koa-jsonp')
const cors = require('koa2-cors')

//实例化
const app = new Koa()

//配置jsonp的中间件
app.use(jsonp())

//配置后台允许跨域  安全性怎么解决啊？-----签名验证
app.use(cors())

//配置post提交的中间件
app.use(bodyParser())

//配置session的中间件
app.keys = ['some secret hurr'];
const CONFIG = {
  key: 'koa.sess',
  maxAge: 864000,
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: true, //每次请求都重新设置session
  renew: false,
  secure: false,
  sameSite: null,
};
app.use(session(CONFIG, app));

//配置模板引擎
render(app, {
  root: path.join(__dirname, 'views'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production',
  dateFormat:dateFormat = function (value) { //自定义管道方法
    return sd.format(value,'YYYY-MM-DD HH:mm') //扩展模板里的方法，实现日期格式化
  }
})
//配置静态资源的中间件
//app.use(static(".")) 这样配置可以解决图片上传的问题，但是不安全
app.use(static(__dirname+'/public'))

//引入层级路由模块
const index = require('./routes/index')
const api = require('./routes/api')
const admin = require('./routes/admin')

router.use(index)
router.use('/admin',admin)
router.use('/api',api)


app.use(router.routes())
app.use(router.allowedMethods())
app.listen(3000)
console.log('http://localhost:3000/')