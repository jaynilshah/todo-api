var {mongoose} = require('./db/mongoose.js');

var {Todo} = require('./models/todo');
var {User} = require('./models/user');

const express = require('express');
var bodyParser = require('body-parser');



var app = express();
app.use(bodyParser.json());


app.listen(3000,()=>{
    console.log('started on port 3000');
});

app.post('/todos',(req,res)=>{
    console.log(req.body);
    var todo = new Todo({
        text: req.body.text,
    });
    todo.save().then((doc)=>{
        res.send(doc);
    },(e)=>{
        if(e)
        res.status(400).send(e);
    })
});



module.exports = {
    app
}






















// var userTodo = mongoose.model('user',{
//     email: {
//         type: String,
//         required: true,
//         minlength: 1,
//         trim: true
//     },
    
// });

// userTodo.save().then((doc)=>{
//     console.log(JSON.stringify(doc,undefined,2))}
//     ,(e)=>{
//         if(e)
//             console.log('Unable to save userTodo');
//     }
// );

// var newTodo = new Todo({
//     text: "Cook Dinner",

// });

// newTodo.save().then((doc)=>{
//     console.log('saved todo',doc);
// },(e)=>{
//     console.log('Unable to save Todo');
// });


// var newTodo = new Todo({
//     text: '        hi'
// });
// newTodo.save().then((doc)=>{
//     console.log('saved Todo',doc);
// },(e)=>{
//     console.log('Unable to save todo');
// })