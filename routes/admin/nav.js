const router = require('koa-router')()
const DB = require('../../model/db')
const tools = require('../../model/tools.js')

router.get('/',async (ctx) => {

  var result = await DB.find('nav',{},{},{
    sort:{add_time:-1}
  })
  await ctx.render('admin/nav/list',{
    list:result,
    prevPage:ctx.state.G.prevPage
  })

})

router.get('/add',async (ctx) => {
  await ctx.render('admin/nav/add')
})

router.post('/doAdd',async (ctx) => {
  //使用multer模块进行图片上传的时候才能使用 ctx.req.body.title接受数据
  //记得把表单的那个enctype属性去掉
  var title = ctx.request.body.title
  var url = ctx.request.body.url
  var sort = ctx.request.body.sort
  var status = ctx.request.body.status
  var add_time = tools.getTime()

  await DB.insert('nav', {title, url, sort, status, add_time})

  ctx.redirect(ctx.state.__HOST__ + '/admin/nav')
})

router.get('/edit',async (ctx) => {

  var id = ctx.query.id
  var result = await DB.find('nav',{"_id":DB.getObjectId(id)})
  await ctx.render('admin/nav/edit',{
    list:result[0]
  })
})

router.post('/doEdit',async (ctx) => {
  //使用multer模块进行图片上传的时候才能使用 ctx.req.body.title接受数据
  var id = ctx.request.body.id
  var title = ctx.request.body.title
  var url = ctx.request.body.url
  var sort = ctx.request.body.sort
  var status = ctx.request.body.status
  var add_time = tools.getTime()
  var prevPage = ctx.request.body.prevPage

  await DB.update('nav', {'_id':DB.getObjectId(id)},{title, url, sort, status, add_time})

  //跳转回修改的位置
  if (prevPage){
    ctx.redirect(prevPage)
  }else{
    ctx.redirect(ctx.state.__HOST__+'/admin/nav')
  }
})


module.exports = router.routes()