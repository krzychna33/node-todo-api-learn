const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () =>{
  it('should create a new todo', (done) =>{
    var text = 'text text';

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res) =>{
      expect(res.body.text).toBe(text);
    })
    .end((err, res) =>{
      if (err) {
        return done(err);
      }

      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => done(e));
    });
  });

  it('Should not create todo wtih invalid body data', (done) =>{

    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err,res) =>{
        if(err){
          return done(err);
        }
      })

      Todo.find().then((todos) =>{
        expect(todos.length).toBe(2);
        done();
      }).catch((e) =>{
        done(e);
      })
  });
});

describe('GET /todos', () =>{
  it('Should get all todos', (done) =>{

    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) =>{
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () =>{
  it('Should return todo doc', (done) =>{
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) =>{
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('Should return 404 error for todo not found', (done) =>{
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('Should return 404 error for no-object ID', (done) =>{
    request(app)
      .get(`/todos/123`)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () =>{
  it('Should remove a todo', (done) =>{
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) =>{
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));
      });
  });

  it('Should return 404 if todo not found', (done) =>{
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('Should return 404 if objectID is not valid', (done) =>{
    request(app)
      .delete(`/todos/123`)
      .expect(404)
      .end(done);
  });

});

describe('PATCH /todos/:id', () =>{
  it('Should update the todo', (done) =>{
    var id = todos[0]._id.toHexString();
    var text = 'Updated text';

    request(app)
      .patch(`/todos/${id}`)
      .send({
        text: text,
        completed: true
      })
      .expect(200)
      .expect((res) =>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done)


  });

  it('Should clear completed at when todo is not completed', (done) =>{
    var id = todos[1]._id.toHexString();

    request(app)
      .patch(`/todos/${id}`)
      .send({
        completed: false
      })
      .expect(200)
      .expect((res) =>{
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done)
  });
});

describe('GEt /users/me', ()=>{
  it('Should get a user if token is correct', (done) =>{

    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) =>{
        expect(res.body.email).toBe(users[0].email)
        expect(res.body._id).toBe(users[0]._id.toHexString())
      })
      .end(done);

    });

    it('Should get a 401 if token is invalid', (done) =>{

      request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) =>{
          expect(res.body).toEqual({});
        })
        .end(done)

    });

});


describe('POST /users', () =>{

  it('Should create a new user', (done)=>{

    var email = 'example@example.com';
    var password = '123mnb!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) =>{
        if(err){
          return done(err);
        }

        User.findOne({email}).then((user)=>{
          expect(user).toExist;
          expect(user.password).toNotBe(password);
          done();
        }).catch((e) => done(e));;
      });

  });


  it('Should return validation errors if email is invalid', (done)=>{

    var invalidEmail = 'abc';
    var password = '123mnb!';

    request(app)
      .post('/users')
      .send({invalidEmail, password})
      .expect(400)
      .end(done)

  });


  it('Should not create user if email inuse', (done)=>{

    var password = '123mnb!';

    request(app)
      .post('/users')
      .send(users[0].email, password)
      .expect(400)
      .end(done)

  });

});

describe('POST /users/login', () =>{

  it('Should login user and return auth token', (done) =>{

    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) =>{
        expect(res.header['x-auth']).toExist();
      })
      .end((err, res) =>{
        if(err){
          done(err);
        }

        User.findById(users[1]._id).then((user)=>{
          expect(user.tokens[0]).toInclude({
            access: 'auth',
            token: res.header['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });

  });

  it('Should reject invalid login', (done) =>{

    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: 'badpassword'
      })
      .expect(400)
      .expect((res) =>{
        expect(res.header['x-auth']).toNotExist();
      })
      .end((err, res) =>{
        if(err){
          done(err);
        }

        User.findById(users[1]._id).then((user) =>{
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));

      });

  });

})
