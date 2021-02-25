//DB库
const MongoClient = require('mongodb').MongoClient;

const Config = require('./config.js');

class Db {
    static getInstance() {
        if (!Db.instance) {
            Db.instance = new Db();
        }
        return Db.instance
    }
    constructor() {
        this.dvClient = ''
        this.connect()
    }

    connect() {
        return new Promise((resolve, reject) => {
            if (!this.dbClient) {
                MongoClient.connect(Config.dbUrl, { useUnifiedTopology: true }, (err, client) => {
                    if (err) {
                        reject(err);
                    }
                    const db = client.db(Config.dbName);
                    this.dbClient = db
                    resolve(this.dbClient);
                })
            } else {
                resolve(this.dbClient)
            }
        })
    }

    find(collectionName, json) {

        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                const result = db.collection(collectionName).find(json)
                result.toArray((err, docs) => {
                    err ? reject(err) : resolve(docs)
                })
            })
        })
    }
    update(collectionName, json1,json2) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).updateOne(json1, {$set:json2},(err, result) => {
                    err ? reject(err) : resolve(result)
                })
            })
        })
    }
    insertOne(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).insertOne(json, (err, result) => {
                    err ? reject(err) : resolve(result)
                })
            })
        })
    }

    remove(collectionName, json){
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).removeOne(json, (err, result) => {
                    err ? reject(err) : resolve(result)
                })
            })
        })
    }
}

const mydb = Db.getInstance();

mydb.find('myTest',{}).then(res=>{
    console.log(res);
})

module.exports = Db.getInstance();