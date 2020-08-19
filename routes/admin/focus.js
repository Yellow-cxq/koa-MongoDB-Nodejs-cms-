const router = require('koa-router')()
const DB = require('../../model/db')
const tools = require('../../model/tools.js')

router.get('/',async (ctx) => {

  var page = ctx.query.page || 1
  var pageSize = 3
  var result = await DB.find('focus',{},{},{
    page,
    pageSize,
    sort:{add_time:-1}
  })
  var count = await DB.count('focus',{})
  await ctx.render('admin/focus/list',{
    list:result,
    page:page,
    totalPages:Math.ceil(count/pageSize)
  })

})

router.get('/add',async (ctx) => {
  await ctx.render('admin/focus/add')
})

router.post('/doAdd',tools.multer().single('pic'),async (ctx) => {
  //upload.single(name)  前台上传表单的name属性值
  //获取post传过来的数据
  //记得在表单中配置enctype="multipart/form-data"
  // ctx.body = {
  //   filename:ctx.req.file?ctx.req.file.filename:"",
  //   body:ctx.req.body
  // }

  //增加到数据库
  var title = ctx.req.body.title
  var pic = ctx.req.file?ctx.req.file.path.substr(7):""
  var url = ctx.req.body.url
  var sort = ctx.req.body.sort
  var status = ctx.req.body.status
  var add_time = tools.getTime()

  var result = await DB.insert('focus',{title,url,pic,sort,status,add_time})

  if (result){
    ctx.redirect(ctx.state.__HOST__+'/admin/focus')
  }

})

router.get('/edit',async (ctx) => {
  //获取get传值
  var id = ctx.query.id
  var result = await DB.find('focus',{"_id":DB.getObjectId(id)})

  await ctx.render('admin/focus/edit',{
    list:result[0],
    prevPage:ctx.state.G.prevPage
  })

})

router.post('/doEdit',tools.multer().single('pic'),async (ctx) => {

  //增加到数据库
  var id = ctx.req.body.id
  var title = ctx.req.body.title
  var pic = ctx.req.file?ctx.req.file.path.substr(7):""
  var url = ctx.req.body.url
  var sort = ctx.req.body.sort
  var status = ctx.req.body.status
  var add_time = tools.getTime()
  var prevPage = ctx.req.body.prevPage

  if(pic){
    var json = {title,url,pic,sort,status,add_time}
  }else{
    var json = {title,url,sort,status,add_time}
  }

  await DB.update('focus',{"_id":DB.getObjectId(id)},json)

  //跳转回修改的位置
  if (prevPage){
   ctx.redirect(prevPage)
  }else{
    ctx.redirect(ctx.state.__HOST__+'/admin/focus')
  }


})

module.exports = router.routes()