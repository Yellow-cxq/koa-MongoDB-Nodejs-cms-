const router = require('koa-router')()
const tools = require('../../model/tools.js')
const DB = require('../../model/db.js')
var svgCaptcha = require('svg-captcha')

router.get('/',async (ctx) => {
  await ctx.render('admin/login')
})

//post
router.post('/doLogin',async (ctx) => {
  //获取post提交的数据
  //console.log(ctx.request.body)
  //首先得去数据库匹配
  let username = ctx.request.body.username
  let password = ctx.request.body.password
  let code = ctx.request.body.code

  //1.验证用户名密码是否合法

  //2.去数据库匹配

  //3.登录成功将用户信息写入session

  if (code.toLowerCase() == ctx.session.code.toLowerCase()){
    //后台也要验证用户名密码是否合法

    //验证码正确才查询数据库
    var result = await DB.find('admin',{"username":username,"password":password})

    if(result.length>0){
      // console.log('登录成功');
      //console.log(result)
      ctx.session.userInfo = result[0]

      //更新用户表 改变用户登录的时间
     await DB.update('admin',{"_id":DB.getObjectId(result[0]._id)},{
        lastLogTime:new Date()
      })
      //登录成功跳转
      ctx.redirect(ctx.state.__HOST__+'/admin')
    }else{
      //console.log('失败')
      ctx.render('admin/error',{
        message:'用户名或者密码错误',
        redirect:ctx.state.__HOST__+ '/admin/login'
      })
    }
  }else{
    ctx.render('admin/error',{
      message:'验证码失败',
      redirect:ctx.state.__HOST__+ '/admin/login'
    })
  }
})

//验证码
router.get('/code',async (ctx) => {
  var captcha = svgCaptcha.create({
    size:4,
    fontSize:50,
    width:120,
    height:34,
    background:'#cc9966'
  })
  //console.log(captcha.text)
  //保存生成的验证码
  ctx.session.code = captcha.text
  //设置响应头部
  ctx.response.type = 'image/svg+xml'
  ctx.body = captcha.data
})

//退出登录
router.get('/loginOut',async (ctx) =>{
  //清除session并跳转回登录界面
  ctx.session.userInfo = null
  ctx.redirect(ctx.state.__HOST__+'/admin/login')
})
module.exports = router.routes()