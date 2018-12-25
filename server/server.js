var {mongoose} = require('./db/mongoose.js');
var {ObjectID} = require('mongodb');

var {Todo} = require('./models/todo');
var {User} = require('./models/user');

const express = require('express');
var bodyParser = require('body-parser');

const port = process.env.PORT || 3000;


var app = express();
app.use(bodyParser.json());


app.listen(port,()=>{
    console.log(`started on port ${port}`);
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

app.get('/todos',(req,res)=>{
    Todo.find().then((todos)=>{
        res.send({todos});
    }),
    (e)=>{
        if(e)
            res.status(400).send(e);
    };
})

app.get('/todos/:id',(req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(404).send();

    Todo.findById(id).then((todos)=>{
        if(!todos)
            return res.status(404).send();   
        
        res.send({todos}); 

    },(e)=>{
        res.status(400).send();
    });
})


app.delete('/todos/:id',(req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(404).send();

    Todo.findByIdAndRemove(id).then((todos)=>{
        if(!todos)
            return res.status(404).send();

        res.send({todos});
    },(e)=>{
        res.status(400).send();
    });
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