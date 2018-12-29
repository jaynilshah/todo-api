const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

var {User} = require('./../models/user');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {Users,populateUsers,todos,populateTodos} = require('./seed/seed');
 



beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST/todos',()=>{

    it('should create a new todo',(done)=>{
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
            })

            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                Todo.find({text}).then((todos)=>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e)=> done(e));
            })
    });


    it('should not create Todo with invalid body data',(done)=>{
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(2);
                    done();

                }).catch((e)=> done(e));
            })
    })
});


describe('GET/todos',()=>{

    it('should get all todos',(done)=>{
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    })



});


describe('GET/todos/:id',()=>{


    it('should return todo doc',(done)=>{

        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return a 404 if todo not found',(done)=>{
        request(app)
            .get(`/todos/${new ObjectID().toHexString}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non object ids',(done)=>{
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    })

});


describe('DELETE /todos/:id', ()=>{

    it('should remove a todo',(done)=>{
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos._id).toBe(todos[0]._id.toHexString());
            })
            .end((err,res)=>{
                if(err)
                    return done(err);
                
                Todo.findById(todos[0]._id.toHexString()).then((todo)=>{
                    expect(todo).toNotExist;
                    done();
                }).catch((e)=> done(e));
                
            });

    });


    it('should return 404 if todo not found',(done)=>{
        request(app)
            .delete(`/todos/${new ObjectID().toHexString}`)
            .expect(404)
            .end(done);

    });

    it('should return 404 if ObjectID is invalid',(done)=>{

        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);

    });
});



describe('PATCH /todos/:id ',()=>{

    it('should update the todo',(done)=>{
        request(app)
            .patch(`/todos/${todos[0]._id.toHexString()}`)
            .send({
                text: 'Send by testing',
                completed: true
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.text).toBe('Send by testing')
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
    });


    it('should clear completed at when todo is not completed',(done)=>{
        request(app)
        .patch(`/todos/${todos[1]._id.toHexString()}`)
        .send({
            text: 'Send by testing 2',
            completed: false
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.text).toBe('Send by testing 2')
            expect(res.body.todo.completedAt).toBeNull();
        })
        .end(done);
    });

});



describe('for GET /users/me',()=>{
    it('should return user if authenticated',(done)=>{
        request(app)
            .get('/users/me')
            .set('x-auth',Users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(Users[0]._id.toHexString());
                expect(res.body.email).toBe(Users[0].email);

            }).end(done);
    });


    it('should return a 401 if not authenticated',(done)=>{
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res)=>{
                expect(res.body).toEqual({});
                

            }).end(done);
    })
});


describe('for POST /users',()=>{

    it('should create a user',(done)=>{
        var email = 'abb@example.com'
        var password = 'Passwordabc'
        request(app)
            .post('/users')
            .send({
                email,password
            })
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toBeDefined();
                expect(res.body._id).toBeDefined();
                expect(res.body.email).toBe(email);
            })
            .end((err)=>{
                if(err)
                    return done(err);

                User.findOne({email}).then((user)=>{
                    expect(user).toBeDefined();
                    expect(user.password).not.toBe(password);
                }).catch((e)=>done(e));
                done();
            });
    });

    it('should return validation error if request invalid',(done)=>{
        var email = 'abb@example'
        var password = 'Pass'
        request(app)
            .post('/users')
            .send({
                email,password
            })
            .expect(400)
            .end(done); 
    });

    it('should not create a user if email in use',(done)=>{
        var email = Users[0].email  ;
        var password = 'Passwordabc';
        request(app)
            .post('/users')
            .send({
                email,password
            })
            .expect(400)
            .end(done);
    });
});



describe('POST /users/login',()=>{

    it('should login user and return auth token',(done)=>{
        request(app)
            .post('/users/login')
            .send({
                email: Users[1].email,
                password: Users[1].password,
            })
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toBeDefined()
            })
            .end((err,res)=>{
                if(err)
                    return done(err);

                User.findById(Users[1]._id).then((user)=>{
                    expect(user.tokens[0]).toHaveProperty('access', 'auth');
                    expect(user.tokens[0]).toHaveProperty('token', user.tokens[0].token);
                    done();
                }).catch((e)=>done(e));

            })
    });



    it('should reject invalid login',(done)=>{
        request(app)
            .post('/users/login')
            .send({
                email: Users[1].email,
                password: Users[1].password + 'abc',
            })
            .expect(400)
            .expect((res)=>{
                expect(res.headers['x-auth']).not.toBeDefined()
            })
            .end((err,res)=>{
                if(err)
                return done(err);
    
            User.findById(Users[1]._id).then((user)=>{
                expect(user.tokens.length).toBe(0);
                done();
                    
            }).catch((e)=>done(e));
    
            })



    });
})


