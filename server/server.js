

require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');


const {mongoose} = require('./db/mongoose.js');
const {ObjectID} = require('mongodb');

var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');


const port = process.env.PORT;


var app = express();
app.use(bodyParser.json());



app.listen(port,()=>{
    console.log(`started on port ${port}`);
});

app.post('/todos',authenticate,(req,res)=>{
    console.log(req.body);
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });
    todo.save().then((doc)=>{
        res.send(doc);
    },(e)=>{
        if(e)
        res.status(400).send(e);
    })
});

app.get('/todos',authenticate,(req,res)=>{
    Todo.find({
        _creator: req.user._id
    }).then((todos)=>{
        res.send({todos});
    }),
    (e)=>{
        if(e)
            res.status(400).send(e);
    };
})

app.get('/todos/:id',authenticate,(req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(404).send();

    Todo.findOne({
        _id : id,
        _creator: req.user._id
    }).then((todos)=>{
        if(!todos)
            return res.status(404).send();   
        
        res.send({todos}); 

    },(e)=>{
        res.status(400).send();
    });
})


app.delete('/todos/:id',authenticate,(req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(404).send();

    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todos)=>{
        if(!todos)
            return res.status(404).send();

        res.send({todos});
    },(e)=>{
        res.status(400).send();
    });
});


app.patch('/todos/:id',authenticate,(req,res)=>{
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
    Todo.findOneAndUpdate({_id: id,_creator: req.user._id},{$set: body},{new : true}).then((todo)=>{
        if(!todo)
            return res.status(404).send();

    res.send({todo});

    }).catch((e)=>{
        res.status(400).send();
    })

});






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




app.get('/users/me', authenticate , (req,res)=>{
    
    res.send(req.user);
});


app.post('/users/login',(req,res)=>{
    var body = _.pick(req.body,['email','password']);
    
    User.findByCredentials(body.email,body.password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            res.header('x-auth',token).send(user);
        })
    })
    .catch((e)=>{
        res.status(400).send(e);
    });

    
    
        
})

app.delete('/users/me/token',authenticate,(req,res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    }).catch((e)=>res.status(400));
})



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