const router = require('koa-router')()
const DB = require('../model/db.js')
const url = require('url')

//配置中间件 获取导航栏的数据
router.use(async (ctx,next) => {
  //导航切换
  var pathname = url.parse(ctx.request.url).pathname
  //console.log(pathname)
  //获取导航栏的数据
  var navResult = await DB.find('nav',{'status':"1"},{},{
    sort:{'sort':1}
  })
  //获取系统设置 用于SEO优化
  var setting = await DB.find('setting',{})

  //模板引擎配置全局变量，模板均可使用
  ctx.state.nav = navResult
  ctx.state.pathname = pathname
  ctx.state.setting = setting[0]
  await next()
})

router.get('/',async (ctx) => {

  //获取轮播图的数据
  var focusResult = await DB.find('focus',{'status':1},{},{
    sort:{'sort':1}
  })

  //友情链接
  var links = await DB.find('link',{'status':'1'},{},{
    sort:{'sort':1}
  })

 await ctx.render('default/index',{
   focus:focusResult,
   links:links
 })

})

router.get('/news',async (ctx) => {

  var page = ctx.query.page || 1
  var pageSize = 3
  var pid = ctx.query.pid
  //设置SEO优化
  ctx.state.setting.site_title='新闻页面'
  ctx.state.setting.site_keywords='新闻页面'
  ctx.state.setting.site_description='新闻页面'
  //获取分类
  var cateResult = await DB.find('articlecate',{'pid':'5afa56bb416f21368039b05d'})

  if(pid){
    var articleResult = await DB.find('article',{'pid':pid},{},{
      page,pageSize
    })
    var articleNumber = await DB.count('article',{'pid':pid})
  }else{
    //获取所有子分类的id
    var subCateArr = []
    for (var i = 0;i < cateResult.length; i++){
      subCateArr.push(cateResult[i]._id.toString())
    }
    var articleResult = await DB.find('article',{'pid':{$in:subCateArr}},{},{
      page,pageSize
    })
    var articleNumber = await DB.count('article',{'pid':{$in:subCateArr}})
  }

  await ctx.render('default/news',{
    cateList:cateResult,
    newsList:articleResult,
    pid:pid,
    page:page,
    totalPages:Math.ceil(articleNumber/pageSize)
  })

})

router.get('/service',async (ctx) => {

  //查询对应集合
  var serviceList = await DB.find('article',{'pid':'5ab34b61c1348e1148e9b8c2'})
  ctx.state.setting.site_title='开发服务'
  ctx.state.setting.site_keywords='开发服务'
  ctx.state.setting.site_description='开发服务'
  await ctx.render('default/service',{
    serviceList:serviceList
  })

})

router.get('/about',async (ctx) => {
  ctx.state.setting.site_title='关于我们'
  ctx.state.setting.site_keywords='关于我们'
  ctx.state.setting.site_description='关于我们'
  await ctx.render('default/about')

})

router.get('/case',async (ctx) => {
  //获取成功案例下面的分类
  var cateResult = await DB.find('articlecate',{"pid":'5ab3209bdf373acae5da097e'})
  ctx.state.setting.site_title='成功案例'
  ctx.state.setting.site_keywords='成功案例'
  ctx.state.setting.site_description='成功案例'
  //获取前台点击时传过来的pid
  var pid = ctx.query.pid
  var page = ctx.query.page || 1
  var pageSize = 3

  //pid用于判断需要查询哪个分类下的所有数据
  //page用于确定查询这些数据中的第几页

  //判断用户是否点击了
  if(pid){
    //用户点击了，显示对应分类下的数据
    var articleResult = await DB.find('article',{"pid":pid},{},{
        page,pageSize
    })
    var articleNumber = await DB.count('article',{"pid":pid})
  }else{
    //循环子分类获取子分类下面的所有的内容
    var subCateArr = []
    for (var i = 0;i < cateResult.length;i++){
      subCateArr.push(cateResult[i]._id.toString())
    }
    //console.log(subCateArr)
    //获取所有子分类下面的数据
    var articleResult = await DB.find('article',{"pid":{$in:subCateArr}},{},{
      page,pageSize
    })
    var articleNumber = await DB.count('article',{"pid":{$in:subCateArr}})
    //console.log(articleResult)
  }

  await ctx.render('default/case',{
    cateList:cateResult,
    articleList:articleResult,
    pid:pid,
    totalPages:Math.ceil(articleNumber/pageSize),
    page:page,
  })

})

router.get('/connect',async (ctx) => {
  ctx.state.setting.site_title='联系我们'
  ctx.state.setting.site_keywords='联系我们'
  ctx.state.setting.site_description='联系我们'
  await ctx.render('default/connect')

})

//详情页面
router.get('/content/:id',async (ctx) => {
  //接收动态路由传值
  //console.log(ctx.params);
  var id = ctx.params.id
  //根据id查出集合中对应数据
  var content = await DB.find('article',{"_id":DB.getObjectId(id)})


  /*
  * 1.根据文章获取文章的分类信息
  *
  * 2.根据文章的分类信息，去导航表里面查找当前分类信息的url
  *
  * 3.把url赋值给pathname
  * */
  //获取当前文章的分类信息
  var cateResult = await DB.find('articlecate',{"_id":DB.getObjectId(content[0].pid)})
  //console.log(cateResult)
  //在导航表查找当前分类对应的url
  if(cateResult[0].pid != 0){ //子分类
    //找到当前子分类的父分类
    var parentCateResult = await DB.find('articlecate',{'_id':DB.getObjectId(cateResult[0].pid)})
    var navResult = await DB.find('nav',{$or:[{"title":cateResult[0].title},{"title":parentCateResult[0].title}]})
  }else{ //父分类
    var navResult = await DB.find('nav',{"title":cateResult[0].title})
  }
  //把url赋值给pathname
  if(navResult.length > 0){
    ctx.state.pathname = navResult[0].url
  }else{
    ctx.state.pathname = '/'
  }

  await ctx.render('default/content',{
    list:content[0]
  })

})







module.exports = router.routes()