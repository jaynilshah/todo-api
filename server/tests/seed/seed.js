
const {ObjectID} = require('mongodb');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneID = new ObjectID();
const usertwoId = new ObjectID();
const todos = [{
    _id: new ObjectID(),
    text : 'First test Todo',

},{
    _id: new ObjectID(),
    completed : true,
    text: 'Seconf test Todo',
    completedAt: 333
}];

const Users = [{
    _id : userOneID,
    email: 'abc@example.com',
    password: 'UseronePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneID, access: 'auth'},'abc123').toString(),
    }]
},{
    _id : usertwoId,
    email: 'abc1@example.com',
    password: 'usertwopass'
}]

const populateUsers = (done)=>{
    User.remove({}).then(()=>{
        var user1 = new User(Users[0]).save()
        var user2 = new User(Users[1]).save();

        return Promise.all([user1,user2])


    }).then(()=>done());
}

const populateTodos = (done)=>{
    Todo.remove({}).then(()=> {
        return Todo.insertMany(todos)
    }).then(()=> done())
};

module.exports = {
    populateTodos,
    todos,
    Users,
    populateUsers
}