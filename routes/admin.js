const router = require('koa-router')()

const index = require('./admin/index.js')
const login = require('./admin/login.js')
const manger = require('./admin/manger.js')
const articlecate = require('./admin/articlecate.js')
const article  = require('./admin/article.js')
const focus = require('./admin/focus.js')
const link = require('./admin/link.js')
const nav = require('./admin/nav.js')
const setting = require('./admin/setting.js')
const url = require('url')

//配置中间件 获取url的地址
router.use(async (ctx,next) => {
  //模板引擎配置全局变量
  ctx.state.__HOST__ = 'http://'+ctx.request.header.host

  //过滤去掉后面的参数  因为验证码图片后面带有时间戳
  var pathname = url.parse(ctx.request.url).pathname.substring(1)

  //左侧菜单选中
  //console.log(pathname.split('/'))
 var splitUrl = pathname.split('/')
  ctx.state.G = {
    //全局用户信息
    url:splitUrl,
    userInfo:ctx.session.userInfo,
    prevPage:ctx.request.headers['referer']  //上一页的地址
  }

  //权限判断
  //登录继续向下匹配
  if(ctx.session.userInfo){
    await next()
  }else{
    //没有登录跳转到登录界面
   if(pathname == 'admin/login' || pathname == 'admin/login/doLogin' || pathname == 'admin/login/code'){
     await next()
   }else{
     ctx.redirect('/admin/login')
   }
  }

})

router.get('/',async (ctx) => {
  await ctx.render('admin/index')
})
router.use(index)   //后台的首页
router.use('/login',login)
router.use('/manger',manger)
router.use('/articlecate',articlecate)
router.use('/article',article)
router.use('/focus',focus)
router.use('/link',link)
router.use('/nav',nav)
router.use('/setting',setting)

//配置富文本编辑器的图片保存目录  记得改public/ueditor/uedit.config.js里面的后台server地址,加上admin
const ueditor = require('koa2-ueditor')
router.all('/editorUpload',ueditor(['public',{
  "imageAllowFiles":[".png",".jpg",".jpeg"],
  "imagePathFormat":"/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"
}]))

module.exports = router.routes()