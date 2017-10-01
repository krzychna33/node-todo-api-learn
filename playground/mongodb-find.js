// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
  if (err){
    return console.log('Unable to connect to MongoDB server.');
  }
  console.log('Connected to MongoDB server.');

  // db.collection('Todos').find({
  //   _id: new ObjectID('59d0c72b079154d02f6118fd')
  // }).toArray().then((docs)=>{
  //   console.log('TODOS')
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) =>{
  //   console.log('Unable to fetch todos..')
  // }) ;

  db.collection('Todos').find().count().then((count)=>{
    console.log('TODOS COUNT:'+count);
  }, (err) =>{
    console.log('Unable to fetch todos..')
  }) ;

  db.collection('Users').find({
    name: 'Krzysiek'
  }).toArray().then((docs) =>{
    console.log('U S E R S ')
    console.log(JSON.stringify(docs, undefined, 2));
    //console.log(docs);
  }, (err) =>{
    console.log('Unable to fetch users...')
  })

  // db.close();
});
