var express = require('express');
var serve_static = require('serve-static');
var http = require('http');

var users = [];
function checkuser(pseudo){
    for(var i=0; i<users.length; i++){
        if(users[i].pseudo==pseudo){return true;}
    }
    return false;
}

function add_user(socket,pseudo){
    var User_present= checkuser(pseudo);
    if(User_present== false){
        var envoie.pseudo=pseudo;
        var envoie.id=socket.id;
        users.push(envoie);
        socket.emit('connect_success',envoie.pseudo);
        console.log(envoie.pseudo+" c'est connecté avec l'id: "+envoie.id);
    }
    else{
        console.log("User already connected");
        var message={code:'CONNECT_FAILED', reason:"Pseudo utilisé, veuillez en choisir un autre!"};
        socket.emit('code',message);
    }
}

/*function private_message(socket,from,to,msg)
{
socket.on('say to someone', (id, msg) => {
// send a private message to the socket with the given id
socket.to(id).emit('my message', msg);
});
}*/



 var app = express();
 //Activation du serveur statique
 app.use(serve_static(__dirname+"/public"));
 //Récupération du serveur http de l'application
 var serveur = http.Server(app);

 //Ecoute sur un seul port
 serveur.listen(8080, function()
 {
 console.log("Serveur en écoute sur le port 8080");
 });

 //Gestion du temps réel
 var io = require('socket.io').listen(serveur);//Import du module pour le serveur

 io.sockets.on('connect', function (socket) {
     console.log("Connect");
     socket.on('login', function(pseudo)
     {
         add_user(socket,pseudo);
     });

     socket.on('disconnect', function(){
         console.log("Un client s'est déconnecté");
     });



     socket.on('message', function(message)
     {
         console.log("J'ai reçu : "+message);
         socket.emit('reponse', message);
         socket.broadcast.emit('message', "J'ai reçu un message d'un utilisateur: "+message);
     });

 });
