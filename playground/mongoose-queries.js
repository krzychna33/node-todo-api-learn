const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '59da4ef1a2e63a13e03ecbd311';
//
// if (!ObjectID.isValid(id)){
//   console.log('ID not valid!');
// }

// Todo.find({
//   _id: id
// }).then((todos) =>{
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) =>{
//   console.log('Todo', todo);
// });
//
// Todo.findById(id).then((todo) =>{
//   if (!todo){
//     return console.log('Id not found!');
//   }
//   console.log('Todo by id: ', todo);
// }).catch((e) => console.log(e));

var userId = '59d51b37ac78161040916feb'
User.findById(userId).then((user) =>{
  if (!user){
    return console.log('User not found in the database!')
  }
  console.log('USER: ', user)
}).catch((e) => console.log(e));
