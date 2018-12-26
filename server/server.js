

require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');


const {mongoose} = require('./db/mongoose.js');
const {ObjectID} = require('mongodb');

var {Todo} = require('./models/todo');
var {User} = require('./models/user');


const port = process.env.PORT;


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


app.patch('/todos/:id',(req,res)=>{
    var id = req.params.id;

    var body = _.pick(req.body, ['text','completed']);

    if(!ObjectID.isValid(id))
        return res.status(404).send();

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }
    else{
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id,{$set: body},{new : true}).then((todo)=>{
        if(!todo)
            return res.status(404).send();

    res.send({todo});

    }).catch((e)=>{
        res.status(400).send();
    })

});

app.get('/users/me',(req,res)=>{
    var token = req.header()
})




app.post('/users',(req,res)=>{

    var body = _.pick(req.body, ['email','password']);

    var user = new User(body);


    user.save().then(()=>{
        return user.generateAuthToken();
    }).then((token)=>{
        res.header('x-auth',token).send(user);
    }).catch((e)=>{
        if(e)
        res.status(400).send(e);
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