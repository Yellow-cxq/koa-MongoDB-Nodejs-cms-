const router = require('koa-router')()
const DB = require('../model/db.js')

router.get('/',async (ctx) => {
  ctx.body = 'api接口'
})

router.get('/catelist',async (ctx) => {
  var result = await DB.find('articlecate',{})
  //console.log(result)
  ctx.body = {
    result:result
  }
})

//vue里面都可以直接获取这些数据了,往这个接口地址发送请求就可以了
router.get('/newslist',async (ctx) => {
  var page = ctx.query.page || 1
  var pageSize = 5
  var result = await DB.find('article',{},{"_id":1,"title":1},{
    page,pageSize
  })
  //console.log(result)
  ctx.body = {
    result:result
  }
})

//增加购物车数据
router.post('/addCart',async (ctx) => {
  //接受客户端提交的数据，主要做的操作就是增加数据的操作

  console.log(ctx.request.body)
  ctx.body={
    'success':true,
    'message':'增加数据成功'
  }
})

//用于修改数据
router.put('/editPeopleInfo',async (ctx) => {
  //接受客户端提交的数据，主要做的操作就是修改数据的操作

  console.log(ctx.request.body)
  ctx.body={
    'success':true,
    'message':'修改数据成功'
  }
})

//用于删除数据
router.delete('/removeCart',async (ctx) => {
  //接受客户端提交的数据，主要做的操作就是删除数据的操作

  console.log(ctx.query)
  ctx.body={
    'success':true,
    'message':'删除数据成功'
  }
})



module.exports = router.routes()