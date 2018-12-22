const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{

if(err){
    console.log('Unable to connect to mongo db server');
    return;
}
    console.log('Connected to mongo db server');
    const db = client.db('TodoApp');

    // db.collection('Todos').find().toArray().then((docs)=>{
    //     console.log('todos');
    //     console.log(JSON.stringify(docs,undefined,2))
    // },(err)=>{
    //     console.log('Unable to fetch todos',err);
    // });


    // db.collection('Todos').find().count().then((count)=>{
    //     console.log('todos');
    //     console.log(count);
    // },(err)=>{
    //     console.log('Unable to fetch todos',err);
    // });

     db.collection('Users').find({name : 'Jaynil'}).toArray().then((docs)=>{
        console.log('todos');
        console.log(JSON.stringify(docs,undefined,2))
    },(err)=>{
        console.log('Unable to fetch todos',err);
    });


    client.close();

});