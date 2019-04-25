const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const cookieParser=require('cookie-parser')
const ejs=require('ejs')
const urlencodedParser=bodyParser.urlencoded({extended:false})
const MongoControl=require('./toos/databasecontrol').MongoControl

const page=new MongoControl('blog','page')
const comment=new MongoControl('blog','comment')

// 时间的处理
const moment=require('moment')
//引入marked解析md为html
const marked=require('marked')

//消除静态拦截
app.use(cookieParser())
app.use(express.static('./static',{
    index:false
}))


//这是后台的功能接口
app.use('/admit',express.static('./static',{index:false}))
app.use('/admit',require('./admit'))

//服务器响应首页请求
app.get('/',function(req,res){
page.find({},function(err,data){
    ejs.renderFile('./ejs-tpl/index.ejs',{data:data},function(error,html){
        res.send(html)
    })
})
})

//服务器获取评论
app.get('/p',function(req,res){
    // console.log(req)
      var _id=req.query._id
    page.findById(_id,function(err,result){
        // console.log(result)
        if(result.length==0){
            res.status(404).send('没有找到')
            return
        }
        // 同时获取评论
        var data=result[0]
        //使用marked处理为html
        data.content=marked(data.content)
        //这里获取的是state为‘1’，即审核通过的
        comment.find({fid:_id,state:1},function(err,result){
            ejs.renderFile('./ejs-tpl/page.ejs',{data:data,comment:result,n:result.length},function(error,html){
            html=html.replace('<!--content-->',data.content)
                res.send(html)
        })    
        })   
    })
})

// 服务器请求数据
app.post('/submitcomment',urlencodedParser,function(req,res){
    var _id=req.query._id
    var {email,content}=req.body
    // console.log(_id,email,content)
    if(!_id||comment==""||email==""){
        res.redirect('/p?_id='+_id)
        return
    }
    else{ 
    comment.insert({
    fid:_id ,
    author:email ,
    content:content,
    state: 0 ,
    date:moment().format('YYYY/MM/DD h:mm:ss') 
    },(err,result)=>{
        if(err)
        {
            res.status(500).send('服务器奔溃了')
            return
        }
        res.redirect('/p?_id='+_id)
    })
    }
})

app.listen(3008)
