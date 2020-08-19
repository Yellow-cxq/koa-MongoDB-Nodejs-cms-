const router = require('koa-router')()
const DB = require('../../model/db')
const tools = require('../../model/tools')

//图片上传模块
const multer = require('koa-multer')
var storage = multer.diskStorage({
  destination:function (req,file,cb) {
    cb(null,'public/upload') //配置上传图片的目录  图片上传的目录必须存在
  },
  filename:function (req,file,cb) {
    var fileFormat = (file.originalname).split(".") //获取后缀名 分割数组
    cb(null,Date.now()+"."+fileFormat[fileFormat.length-1])
  }
})
var upload = multer({storage:storage})

router.get('/',async (ctx) => {

  var page = ctx.query.page || 1
  var pageSize = 5
  var count = await DB.count('article',{})
  var result = await DB.find('article',{},{},{
    page,
    pageSize,
    sort:{"add_time":-1},
  })
  await ctx.render('admin/article/index',{
    list:result,
    page:page,
    totalPages:Math.ceil(count/pageSize)
  })

})

router.get('/add',async (ctx) => {
 //查询分类数据
  var cateList = await DB.find('articlecate',{})
  //console.log(cateList)
  await ctx.render('admin/article/add',{
   cateList:tools.cateToList(cateList)
  })

})


router.post('/doAdd',upload.single('img_url'),async (ctx) => {
  // ctx.body = {
  //  filename:ctx.req.file?ctx.req.file.filename:"",  //返回文件名
  //  body:ctx.req.body
  // }
  let pid = ctx.req.body.pid
  let catename = ctx.req.body.catename.trim()
  let title = ctx.req.body.title.trim()
  let author = ctx.req.body.author.trim()
  let pic = ctx.req.body.pic
  let status = ctx.req.body.status
  let is_best = ctx.req.body.is_best
  let is_hot = ctx.req.body.is_hot
  let is_new = ctx.req.body.is_new
  let keywords = ctx.req.body.keywords
  let description = ctx.req.body.description || ''
  let content = ctx.req.body.content || ''

  let add_time = tools.getTime()

  let img_url = ctx.req.file?ctx.req.file.path.substr(7):''
  //console.log(img_url)
  let json = {
    pid,catename,title,author,pic,status,is_best,is_hot,
    is_new,keywords,description,content,img_url,add_time
  }
  var result = await DB.insert('article',json)

  if (result){
    ctx.redirect(ctx.state.__HOST__+'/admin/article')
  }

  })

router.get('/edit',async (ctx) => {

  var id  = ctx.query.id
  //查询分类数据
  var cateList = await DB.find('articlecate',{})
  //当前要编辑的数据
  var articleList = await DB.find('article',{"_id":DB.getObjectId(id)})

  //console.log(cateList)
  await ctx.render('admin/article/edit',{
    cateList:tools.cateToList(cateList),
    list:articleList[0],
    prevPage:ctx.state.G.prevPage
  })

})

router.post('/doEdit',upload.single('img_url'),async (ctx) => {

  let prevPage = ctx.req.body.prevPage
  let id = ctx.req.body.id
  let pid = ctx.req.body.pid
  let catename = ctx.req.body.catename.trim()
  let title = ctx.req.body.title.trim()
  let author = ctx.req.body.author.trim()
  let pic = ctx.req.body.pic
  let status = ctx.req.body.status
  let is_best = ctx.req.body.is_best
  let is_hot = ctx.req.body.is_hot
  let is_new = ctx.req.body.is_new
  let keywords = ctx.req.body.keywords
  let description = ctx.req.body.description || ''
  let content = ctx.req.body.content || ''

  let img_url = ctx.req.file?ctx.req.file.path.substr(7):''
  //注意是否修改了图片
 if(img_url){
   var json = {
     pid,catename,title,author,pic,status,is_best,is_hot,
     is_new,keywords,description,content,img_url
   }
 }else{
   var json = {
     pid,catename,title,author,pic,status,is_best,is_hot,
     is_new,keywords,description,content
   }
 }

  await DB.update('article',{"_id":DB.getObjectId(id)},json)

  if (prevPage){
    ctx.redirect(prevPage)
  }else{
    ctx.redirect(ctx.state.__HOST__+'/admin/article')
  }

})

module.exports = router.routes()