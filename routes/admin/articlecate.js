const router = require('koa-router')()
const DB = require('../../model/db')
const tools = require('../../model/tools')

router.get('/',async (ctx) => {

  var result = await DB.find('articlecate',{})
  //console.log(result)
  await ctx.render('admin/articlecate/index',{
    list:tools.cateToList(result)
  })

})

router.get('/add',async (ctx) => {
  //获取一级分类
  var result = await DB.find('articlecate',{"pid":'0'})
  //console.log(result)
  await ctx.render('admin/articlecate/add',{
    cateList:result
  })
})

router.post('/doAdd',async (ctx) => {
  //console.log(ctx.request.body)
  var addData = ctx.request.body
  var result =  await DB.insert('articlecate',addData)
  if (result){
    ctx.redirect(ctx.state.__HOST__ + '/admin/articlecate')
  }
})

router.get('/edit',async (ctx) => {

  var id = ctx.query.id

  var result = await DB.find('articlecate',{"_id":DB.getObjectId(id)})
  var articlecate = await DB.find('articlecate',{"pid":'0'})

  await ctx.render('admin/articlecate/edit',{
    list:result[0],
    cateList:articlecate
  })

})

router.post('/doEdit',async (ctx) => {

  //获取提交的数据
  var editData = ctx.request.body
  //console.log(ctx.request.body)

  var id = editData.id    //前台设置隐藏的表单传过来
  var title = editData.title
  var pid = editData.pid
  var keywords = editData.keywords
  var status = editData.status
  var description = editData.description

  var result = await DB.update('articlecate',{"_id":DB.getObjectId(id)},
    {
      title,
      pid,
      keywords,
      status,
      description
    })
  if (result) {
    ctx.redirect(ctx.state.__HOST__ + '/admin/articlecate')
  }
})


module.exports = router.routes()