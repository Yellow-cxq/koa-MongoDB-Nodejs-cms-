const router = require('koa-router')()
const DB = require('../../model/db.js')

router.get('/',async (ctx) => {
  ctx.render('admin/index')
})

//公共的改变状态的方法
router.get('/changeStatus',async (ctx) => {
  //console.log(ctx.query);

  //根据前端触发的ajax请求更新表
  var collectionName = ctx.query.collectionName  //数据库表
  var attr = ctx.query.attr           //字段名
  var id = ctx.query.id              //id

  //查表
  var data = await DB.find(collectionName,{"_id":DB.getObjectId(id)})
  //console.log(data)
  if(data.length > 0){
    if(data[0][attr] == 1){
      var json = {
        [attr]:0  //es6属性名表达式
      }
    }else{
      var json = {
        [attr]:1
      }
    }
    //更新
    let updateResult = await DB.update(collectionName,{"_id":DB.getObjectId(id)},json)
    if (updateResult) {
      //给前端返回数据
      ctx.body = {"message":"更新成功","success":true}
    }else{
      ctx.body = {"message":"更新失败","success":false}
    }
  }else{
    ctx.body = {"message":"参数错误，请核对后重新发送","success":false}
  }
})

//公共的删除方法
router.get('/remove',async (ctx) => {
  try {
    var collectionName = ctx.query.collectionName  //数据库表
    var id = ctx.query.id              //要删除的id

    var result = await DB.remove(collectionName, {"_id": DB.getObjectId(id)})

    if (result) {
      //返回到哪里？这是公共的一个方法------返回到上一个页面就可以了
      ctx.redirect(ctx.state.G.prevPage)
    }
  } catch (e) {
    ctx.redirect(ctx.state.G.prevPage)
  }
})

//改变排序的ajax接口
router.get('/changeSort',async (ctx) => {
    //console.log(ctx.query);

    //根据前端触发的ajax请求更新表
    var collectionName = ctx.query.collectionName  //数据库表
    var sortValue = ctx.query.sortValue           //序值
    var id = ctx.query.id              //id
    var json = {sort:sortValue}
    //查表
    let updateResult = await DB.update(collectionName,{"_id":DB.getObjectId(id)},json)
    if (updateResult){
      ctx.body = {"message":"更新成功","success":true}
    }else{
      ctx.body = {"message":"更新失败","success":false}
    }
})

module.exports = router.routes()