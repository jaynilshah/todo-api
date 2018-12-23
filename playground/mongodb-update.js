const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{

if(err){
    console.log('Unable to connect to mongo db server');
    return;
}
    console.log('Connected to mongo db server');
    const db = client.db('TodoApp');

    // db.collection('Todos').findOneAndUpdate({_id: new ObjectID("5c1eb2f10173440c57abcfa2")}, {$set:{completed: true}},{returnOriginal: false}).then((result)=>{
    //     console.log(result);
    // });


    db.collection('Users').findOneAndUpdate({_id: new ObjectID("5c1f8d3156928784be328bef")}, {$set:{name: "Jaynil"},$inc:{age : 2}},{returnOriginal: false}).then((result)=>{
        console.log(result);
    })


    client.close(); 

});