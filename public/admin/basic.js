//调用api接口
$(function () {
  app.confirmDelete()
})
var app = {

  toggle:function (el,collectionName,attr,id) {
    $.get('/admin/changeStatus',{collectionName:collectionName,attr:attr,id:id},function (data) {
      if(data.success){  //根据后台返回的数据来进行判断
        if (el.src.indexOf('yes') != -1){
          el.src = '/admin/images/no.gif'
        } else {
          el.src = '/admin/images/yes.gif'
        }
      }
    })
  },

  confirmDelete(){
    $('.delete').click(function () {
      var flag = confirm("您确定删除吗？")
      //返回false将阻止href的默认行为
      return flag
    })
  },

  changeSort(el,collectionName,id){
    var sortValue = el.value
    $.get('/admin/changeSort',{collectionName:collectionName,sortValue:sortValue,id:id},function (data) {
      console.log(data)
    })
  }
}