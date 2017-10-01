// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);
// var user = {name: "Krzysiek", age: 25 };
// var {name} = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
  if (err){
    return console.log('Unable to connect to MongoDB server.');
  }
  console.log('Connected to MongoDB server.');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err){
  //     return console.log('Unable to insert todo', err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // db.collection('Users').insertOne({
  //   name: 'Krzysiek',
  //   age: 18,
  //   location: 'Poland'
  // }, (err, result) =>{
  //   if (err){
  //     return console.log('Unable to insert todo', err);
  //   }
  //
  //   console.log(result.ops[0]._id.getTimestamp());
  // });

  // db.collection('Todos').insertMany([
  //   {
  //     text: "smtg",
  //     completed: false
  //   },
  //   {
  //     text: "smtg2",
  //     completed: false
  //   }], (err, result) =>{
  //       if (err){
  //         return console.log('Unable to insert todo', err);
  //       }
  //
  //       console.log(JSON.stringify(result.ops, undefined, 2));
  //   });

    db.collection('Todos').insertMany([
      {
        text: "smtg3",
        completed: false
      },
      {
        text: "smtg4",
        completed: false
      }]).then((result) =>{
        console.log(JSON.stringify(result.ops, undefined, 2));
      }, (err) =>{
        console.log('Unable to add new documents...')
      });









  db.close();
});
