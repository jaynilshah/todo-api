const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{

if(err){
    console.log('Unable to connect to mongo db server');
    return;
}
    console.log('Connected to mongo db server');
    const db = client.db('TodoApp');

    // db.collection('Users').deleteMany({name: 'Jaynil'}).then((result)=>{
    //     console.log(result);
    // });


    var x = new ObjectID("5c1eb24d8711940f77d7b9db");
    db.collection('Users').findOneAndDelete({_id : x }).then((result)=>{
        console.log(result);
    });

    client.close(); 

});