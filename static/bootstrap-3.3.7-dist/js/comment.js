var check=document.getElementById('checking')
check.addEventListener('click',function(){
    getContent() 
}) //这里出错的原因是On和addEventListener的区别


//删除内容操作
var del=document.getElementById('del')
del.addEventListener('click',function(){
    getdeleteContent()
})


var passComment=function(_id){
    console.log(_id)
    $.ajax({
        type:'get',
        url:'/admit/passComment' ,
        data:{
            _id:_id
        },
        success:function(e){
            // console.log(e)
            getContent()
        }
    })
}

var nopassComment=function(_id){
    console.log(_id)
    $.ajax({
        type:'get',
        url:'/admit/nopassComment' , 
        data:{_id:_id},
        success:function(e){
            // console.log(e)
            getContent()
        }
    })
}

//监听两个审核按钮
var addEventListen=function(){
    $('.btn-yes').on('click',function(){
        var get_id=$(this).attr('data-_id')
        // console.log(get_id)
      passComment(get_id)
    //   getContent()
    })
    $('.btn-no').on('click',function(){
        var get_id=$(this).attr('data-_id')
        nopassComment(get_id)
        // getContent()
    })
}  

//填充要审核的数据
var fillContent = function (arr) {   
    var html = ''
 arr.forEach(function(e) {
  html+=`<div class="panel panel-danger">
    <div class="panel-heading"><strong>作者：</strong> ${e.author}</div>
    <div class="panel-body"> 
            <strong><em>评论标题:</em></strong>
            <div class="well-sm">${e.f_title}</div> 
            <strong><em>评论简介:</em></strong> 
            <div class="well-sm">${e.f_intro} </div> 
            <strong><em>评论内容:</em></strong> 
            <div class="well-sm">${e.content} </div>   
    </div>
    <p>日期：${e.date}</p>
    <div class="panel-footer">
        <button type="button" class="btn-lg-2 btn-success btn-yes" data-_id="${e._id}">通过</button>
        <button type="button" class="btn-lg-2 btn-warning btn-no" data-_id="${e._id}">不通过</button>
    </div>
  </div>` 
     })
     if(!arr.length){
         html=`<div class="well active">没有需要审核的数据</div>`
     }
     $('#shenghe').html(html)
     addEventListen()
    
 } 

// 前台获取评论
var getContent=function(){ 
    $.ajax({
        type: 'get',
        url: '/admit/getComment',//http://127.0.0.1:3008
        data: {},
        success: function (e) {
            // console.log(e)
            fillContent(e)
        }   
    })
}




//==================================================================
// ajax请求删除数据
var getDeleteData=function(_id){
$.ajax({
    type:'get' ,
    url:'/admit/deldata' ,//http://127.0.0.1:3008
    data:{
        _id:_id
    },
    success:function(e){
    //   console.log(e)
    getdeleteContent()
    }
})
}

//监听删除按钮
var listeneDete=function(){
     $('.delete-btn').on('click',function(){
         var getdel_id=$(this).attr('data-_id')
        //  console.log(getdel_id)
        getDeleteData(getdel_id)
     })
}

//将获取到的数据填充到页面中
fillDeleteContent=function(arrys){
    // console.log(arrys)
    let html=''
     arrys.forEach((e)=>{
         html+=` 
         <div class="list-group">
                 <a href="#" class="list-group-item active">
                 <div class="panel-heading"><strong>作者：</strong> ${e.author} <strong> &nbsp &nbsp &nbsp &nbsp 日期：</strong>${e.date} &nbsp &nbsp &nbsp &nbsp 
                 <button type="button" class="btn-lg-3 btn btn-danger delete-btn" data-_id="${e._id}">删除</button> 
                 </div>
                 </a>
                 <div class="list-group-item"><strong>标题：</strong>
                 <div class="well-sm">${e.title}</div>
                  </div>
                 <div class="list-group-item"><strong>内容：</strong> 
                 <div class="well-sm">${e.content}</div>
                 </div>
               </div>
               `
               if(!arrys.length){
                html=`<div class="well active">您没有发表文章</div>`
            }
            $('#delete').html(html)
            listeneDete()
     })

}
//获取所有前端的文章
var getdeleteContent=function(){
   $.ajax({
       type:'get' ,
       url:'/admit/getdeletecontent' ,
       data:{},
       success:function(e){
     fillDeleteContent(e)
       }
   })
}