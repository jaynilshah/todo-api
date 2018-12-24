const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '15c211ef55927731d313932f8';


// Todo.find({
//     _id: id
// }).then((todos)=>{
//     console.log(todos);
// });



// Todo.findOne({
//     _id: id
// }).then((todos)=>{
//     console.log(todos);
// });

// if(!ObjectID.isValid(id))
//         console.log('Id is invalid');

// Todo.findById(id).then((todos)=>{
    
    
//     if(!todos)
//         return console.log('id not found');
//     console.log(todos);
// });

User.findById('5c1ff4c7a335170c4f14264d').then((user)=>{


    if(!user)
        return console.log('USer not found');

    console.log(JSON.stringify(user,undefined,2));

},(e)=>{
    console.log(e)}
    );