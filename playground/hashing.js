const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc';

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash)=>{
//     console.log(hash);
//   });
// });


var hashedPassword = '$2a$10$2QHP/1GbtEcNmj1dmMicDO/Kcje0K8SC/BTdZXAB1AV7oc6xVuaW.X';

bcrypt.compare(password, hashedPassword, (err, res) =>{
  console.log(res);
})

















// var data = {
//   id: 10
// }
//
// var token = jwt.sign(data, '123abc');
// console.log(token)
//
// var decoded = jwt.verify(token, '123abc');
// console.log('decoded', decoded);



//
// var message = 'I am user number 3';
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// var data = {
//   id: 4
// };
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'secret').toString()
// }
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'secret2').toString();
//
// console.log(token.hash);
// console.log(resultHash);
//
// if (token.hash === resultHash){
//   console.log("Hashes are the same");
// } else {
//   console.log("Hashes changed!")
// }
