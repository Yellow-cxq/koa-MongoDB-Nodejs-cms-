const router = require('koa-router')()
const DB = require('../../model/db')

router.get('/',async (ctx) => {
  var result = await DB.find('admin',{})
  //console.log(result)
  await ctx.render('admin/manger/list',{
    list:result
  })
})

router.get('/add',async (ctx) => {
  await ctx.render('admin/manger/add')
})

router.post('/doAdd',async (ctx) => {

  //增加用户
  //1.获取表单提交的数据
  //console.log(ctx.request.body)

  //2.验证表单数据是否合法

  //3.查询数据库是否存在

  //4.增加管理员

  var username = ctx.request.body.username
  var password = ctx.request.body.password
  var rpassword = ctx.request.body.rpassword

  if (!/\w{4,20}/.test(username)){
    await ctx.render('admin/error',{
      message:"用户名不合法",
      redirect:ctx.state.__HOST__ + '/admin/manger/add'
    })
  }else if(password != rpassword || password.length < 6){
    await ctx.render('admin/error',{
      message:"密码和确认密码不一致或者密码长度小于6位",
      redirect:ctx.state.__HOST__ + '/admin/manger/add'
    })
  }else{
    //数据库查重
    var result = await DB.find('admin',{"username":username})
    if (result.length > 0){
      await ctx.render('admin/error',{
        message:"此用户名已存在，请重新输入",
        redirect:ctx.state.__HOST__ + '/admin/manger/add'
      })
    }else{
      //增加管理员
      await DB.insert('admin',{"username":username,'password':password,"status":1,"lastLogTime":''})
      ctx.redirect(ctx.state.__HOST__ + '/admin/manger')
    }
  }

})

router.get('/edit',async (ctx) => {
  //获取get传值
  var id = ctx.query.id
  var result = await DB.find('admin',{"_id":DB.getObjectId(id)})

  await ctx.render('admin/manger/edit',{
    list:result[0]
  })
  //console.log(result)
})

router.post('/doEdit',async (ctx) => {
  //获取提交的数据
  //console.log(ctx.request.body)

  var id = ctx.request.body.id
  var password = ctx.request.body.password
  var rpassword = ctx.request.body.rpassword

  if (password != ''){
    if(password != rpassword || password.length < 6){
     await ctx.render('admin/error',{
        message:"密码和确认密码不一致或者密码长度小于6位",
        redirect:ctx.state.__HOST__ + '/admin/manger/edit?id='+id
      })
    }else{
       //更新密码
      await DB.update('admin',{"_id":DB.getObjectId(id)},{"password":password})
      ctx.redirect(ctx.state.__HOST__ + '/admin/manger')
    }
  }else{
    ctx.redirect(ctx.state.__HOST__ + '/admin/manger')
  }

})


module.exports = router.routes()