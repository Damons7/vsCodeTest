const koa = require('koa')
const router = require('koa-router')()
const mongoose = require('mongoose');
var bodyParser = require('koa-bodyparser');
const app = new koa()
app.use(bodyParser());
//加密
const bcryptjs =require('bcryptjs')
//引入user
const User = require('../module/user.js');

mongoose.connect('mongodb://localhost:27017/myTest', { useUnifiedTopology: true }).then(()=>{
    console.log('链接成功');
}).catch((err)=>{
    console.log(err,'错误');
})
router.post('/api/admin', async ctx => {

  const res = await User.find({email:ctx.request.body.email})
  if(!res.length){
   const newUser =new User({
       name:ctx.request.body.name,
       email:ctx.request.body.email,
       password:ctx.request.body.password,
   });
   //对password加密
  await  new Promise((resolve,reject)=>{
        bcryptjs.genSalt(10,(err,salt)=>{
            bcryptjs.hash(newUser.password,salt,(err,hash)=>{
               if(err){
                   reject(err)
    
               }
             
                newUser.password =hash
                resolve( newUser.password)
         
            })
        })
    })

   await newUser.save().then(user=>{
       ctx.body = user;
       console.log('新加：',newUser);
   }).catch(err=>{
       console.log(err,'添加失败');
   })

   //返回json数据
   ctx.body=newUser

  }else{
    console.log('被占用');
  }
    

})
app.use(router.routes()).use(router.allowedMethods())

const port = process.env.PORT || 6008

app.listen(port, () => {
    console.log(`serve started on ${port}`);
})







