var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/cookbook', {useNewUrlParser: true});

var db = mongoose.connection;
console.log('ready state: '+mongoose.connection.readyState);
db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
db.once('open', function (){
    console.log("database OK");
});
