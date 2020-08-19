const md5 = require('md5')
const multer = require('koa-multer')

let tools = {
  //md5加密
  md5(){
    return md5(str)
  },
  //多级分类列表
  cateToList(data){
    //console.log(data)
    //1.获取一级分类

    var firstArr = []

    for (var i = 0; i < data.length; i++) {
     if(data[i].pid == '0'){
       firstArr.push(data[i])
     }
    }
    //console.log(firstArr)
    
    //2.获取二级分类

    for (var i = 0; i < firstArr.length; i++) {
      firstArr[i].list = []
      for (var j = 0; j < data.length; j++) {
        if (firstArr[i]._id == data[j].pid) {
          firstArr[i].list.push(data[j])
        }
      }
    }
    //console.log(firstArr)
    return firstArr
  },

  getTime(){
    return new Date()
  },

  //配置公共上传图片的方法
  multer(){
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
    return upload
  },
}



module.exports = tools