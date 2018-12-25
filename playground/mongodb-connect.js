const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{

if(err){
    console.log('Unable to connect to mongo db server');
    return;
}
    console.log('Connected to mongo db server');
    const db = client.db('TodoApp');

    db.collection('Todos').insertOne({
        text: 'Something to do',
        completed : false
    },(err,result)=>{
        if(err)
            return console.log('Unable to insert todo',err);
        
        console.log(JSON.stringify(result.ops,undefined,2));
    });

    
    // db.collection('Users').insertOne({
    //     name: 'Jaynil',
    //     Age: 25,
    //     location: 'Vadodara'
    // },(err,result)=>{
    //     if(err)
    //         return console.log('Unable to insert user',err);
        
    //     console.log(JSON.stringify(result.ops,undefined,2));

    // })

    client.close();

});