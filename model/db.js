//DB库

const MongoClient = require('mongodb').MongoClient

const ObjectID = require('mongodb').ObjectID

const Config = require('./config')


class Db {

  //单例 解决多次实例化不共享的问题
  static getInstance(){
    if(!Db.instance){
      Db.instance = new Db()
    }
    return Db.instance
  }

  constructor(){
    this.connect()
    this.dbClient = ""  //解决一个实例对象多次连接数据库的问题
  }

  //连接数据库的方法
  connect(){
    return new Promise((resolve,reject) => {
      if(!this.dbClient){
        MongoClient.connect(Config.dbUrl,{ useUnifiedTopology: true },(err,client) => {
          if(err){
            reject(err)
            return
          }else{
            this.dbClient = client.db(Config.dbName)
            resolve(this.dbClient)
          }
        })
      }else{
        resolve(this.dbClient)
      }
    })
  }


  /*
  * DB.find('admin',{}) 返回所有数据
  *
  * DB.find('admin',{},{"title":1})  只返回一列的所有的数据
  *
  * DB.find('admin',{},{}，{page:2,pageSize:20,sort:{"add_time":-1}) 返回第二页的数据
  * 
  * */
  //查询
  find(collectionName,json1,json2,json3){
    //判断传入的是几个参数
    if(arguments.length == 2){
      var attr = {}   //查询全部
      var slipNum = 0
      var pageSize = 0
    }else if(arguments.length == 3){
      var attr = json2   //查询指定字段
      var slipNum = 0
      var pageSize = 0
    }else if(arguments.length == 4){
      var attr = json2   //查询指定页
      var page = json3.page || 1
      var pageSize = json3.pageSize || 20
      var slipNum = (page-1)*pageSize
      if(json3.sort){
        var sort = json3.sort
      }else{
        var sort = {}
      }
    }else{
      console.log("传入参数错误")
    }

    return new Promise((resolve,reject) => {
      this.connect().then((db) => {
        var result = db.collection(collectionName).find(json1,{fields:attr}).skip(slipNum).limit(pageSize).sort(sort)
        result.toArray((err,docs) => {
          if(err){
            reject(err)
            return
          }
          resolve(docs)
        })
      })
    })
  }


  //更新
  update(collectionName,json1,json2){
    return new Promise((resolve,reject) => {
      this.connect().then((db) => {
        db.collection(collectionName).updateOne(json1,{$set:json2},(err,result) =>{
          if (err){
            reject(err)
            return
          }
          resolve(result)
        })
      })
    })
  }

  //插入
  insert(collectionName,json){
    return new Promise((resolve,reject) => {
      this.connect().then((db) => {
        db.collection(collectionName).insertOne(json,(err,result)=>{
          if(err){
            reject(err)
            return
          }
          resolve(result)
        })
      })
    })
  }

  //删除
  remove(collectionName,json){
    return new Promise((resolve,reject) => {
      this.connect().then((db) => {
        db.collection(collectionName).removeOne(json,(err,result)=>{
          if(err){
            reject(err)
            return
          }
          resolve(result)
        })
      })
    })
  }

  //根据_id查表时，将id字符串转换为对象
  getObjectId(id){
    return ObjectID(id)
  }

  //统计数量的方法
  count(collectionName,json){
    return new Promise((resolve,reject) => {
      this.connect().then((db) => {

       var result = db.collection(collectionName).countDocuments(json)
       result.then(function (count) {
         resolve(count)
       })
      })
    })
  }
}

//向外暴露
module.exports = Db.getInstance()