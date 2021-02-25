const MongoClient = require('mongodb').MongoClient;

const dbUrl = 'mongodb://localhost:27017/';

const dbName = 'koa';

//连接数据库
MongoClient.connect(dbUrl,(err,client)=>{
    if(err){
        console.log('连接失败');
        return;
    }
    const db = client.db(dbName);

    //增加数据

    db.collection('user').insertOne()

})