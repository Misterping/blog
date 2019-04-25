var express=require('express')
var router=express.Router()
var bodyParser=require('body-parser')
var urlencodeParser=bodyParser.urlencoded({extended:false})
var path=require('path')

var MongoControl=require('./toos/databasecontrol').MongoControl
var page=new MongoControl('blog','page')
const comment=new MongoControl('blog','comment')
//引入时间库
const moment=require('moment')


//路由到后台请求
router.get('/',function(req,res){
    // console.log(req.cookies.token) //这里出错过cookie和cookies的区别（是cookies）
    if(req.cookies.token =='3f37fg3e3d3kk3994n'){
       res.sendFile(path.resolve('./static/admit.html')) 
    }
    else{     
        //    res.redirect('/admit/login') //这里需要改进
        res.sendFile(path.resolve('./static/firstlogin.html'))
        //  res.status(403).send('你没有权限访问，请先登录')
    }
})

router.get('/login',function(req,res){
    res.sendFile(path.resolve('./static/login.html'))
})
router.post('/login',urlencodeParser,function(req,res){
    // console.log(req.body.username,req.body.passward)
      if(req.body.username=='admit'&& req.body.passward=='admit'){
          res.cookie('token','3f37fg3e3d3kk3994n')
          res.redirect('/admit')
      }
      else{
          res.status(403).send('你输入的账号、密码不对')
      }
})

router.post('/uppage',urlencodeParser,function(req,res){
    if(req.cookies.token =='3f37fg3e3d3kk3994n'){
    }
    else{
        res.status(403).send('禁止访问，请先登录')
        return
    }
     var {title,intro, sort,author,content}=req.body
    if(title=='' || content==' ')
    {
        res.redirect('/admit')
    }
    else{   
    page.insert({
        title:title,
        intro:intro ,
        sort:sort,
        author:author ,
        content:content ,
        date:moment().format('YYYY/MM/DD HH：MM：SS')
    },()=>{
        res.redirect('/')
        // res.send('文章插入成功')
    })  
    }
})


//获取评论的接口
router.get('/getComment',function(req,res){
       res.setHeader('Access-Control-Allow-Origin','*')
       //这里获取状态为'0'的评论
        comment.find({ state:0},function(err,data){
            if(data.length==0){ 
            res.send([])
            return
        }
            var count=0
         for(var i=0; i< data.length; i++){
             var nowData=data[i]
              var nowDataFid=nowData.fid
              page.findById(nowDataFid,function(error,result){
                      var page=result[0]
                      nowData.f_title=page.title
                      nowData.f_intro=page.intro
                    //    arr.push(nowData)
                    count++    
              if(count == data.length){
                //   console.log(data)
               res.send(data)
            }            
      })     
     }
     }) 
    })

// 后端路由管理评论
router.get('/passComment',function(req,res){
    res.setHeader('Access-Control-Allow-Origin','*')
    var _id=req.query._id
    //这里设置状态为'1',审核通过
    comment.updateById(_id,{state:1},function(error,result){
       res.send({result:'ok'})
    })
})
//不通过的评论
router.get('/nopassComment',function(req,res){
    res.setHeader('Access-Control-Allow-Origin','*')
    var _id=req.query._id
    //   console.log(_id)
      //这里设置转态为'2'，不通过审核
    comment.updateById(_id,{state:2},function(error,result){
       res.send({result:'ok'})
    })
})


//-===================================================================
//后端获取所有的文章
router.get('/getdeleteContent',function(req,res){
    res.setHeader('Access-Control-Allow-Origin','*')
    page.find({},function(error,result){
           if(error)
           {
               res.status(500).send('未找到数据')
               return
           }
           else{
               res.send(result)
           }
    })
})

//后端路由到删除的某个数据
router.get('/deldata',function(req,res){
     res.setHeader('Access-Control-Allow-Origin','*')
      var _id=req.query._id
 //这里出过错removeById({_id:_id}写法错误，会出现：Argument passed in must be a single String of 12
//   bytes or a string of 24 hex characters
    page.removeById(_id,function(error,result){
        var ok=result.ok
        var n=result.n
        //如果文章删除成功，开始删除相关的评论
             if(ok== 1 && n==1)
             {      //找到文章对应的评论
                comment.find({fid:_id},function(error,data){
                    for(var i=0;i<data.length;i++)
                    { 
                    var nowData_id=data[i]._id
                      comment.removeById(nowData_id,function(err,datas){
                        //   console.log('删除成功')
                      })
                    }
                })
             }
            res.send('data:ok,result:ok')
    })
})

module.exports=router