//------------------------------------------------------------------------------
var express = require('express');
var serve_static = require('serve-static');
var http = require('http');
var app = express();
//Activation du serveur statique
app.use(serve_static(__dirname+"/public"));
//Récupération du serveur http de l'application
var serveur = http.Server(app);
//------------------------------------------------------------------------------
 //Ecoute sur un seul port
serveur.listen(8080, function()
{
console.log("Serveur en écoute sur le port 8080");
});
//Gestion du temps réel
var io = require('socket.io').listen(serveur);//Import du module pour le serveur
//------------------------------------------------------------------------------
var rooms = 0; //Room to play
//------------------------------------------------------------------------------
//Serveur
 io.sockets.on('connect', function (socket) {

     socket.on('login', function(pseudo)
     {
         console.log("A user connect to the server!");

     });

     socket.on('disconnect', function(){
         console.log("Un client s'est déconnecté");
     });



     /**
     * Create a new game room and notify the creator of game.
     */
    socket.on('createGame', function(data){
      socket.join('room-' + ++rooms);
      socket.emit('newGame', {name: data.name, room: 'room-'+rooms});
    });

    /**
     * Connect the Player 2 to the room he requested. Show error if room full.
     */
    socket.on('joinGame', function(data){
      var room = io.nsps['/'].adapter.rooms[data.room];
      if( room && room.length == 1){
        socket.join(data.room);
        socket.broadcast.to(data.room).emit('player1', {});
        socket.emit('player2', {name: data.name, room: data.room })
      }
      else {
        socket.emit('err', {message: 'Sorry, The room is full!'});
      }
    });

    /**
     * Handle the turn played by either player and notify the other.
     */
    socket.on('playTurn', function(data){
      socket.broadcast.to(data.room).emit('turnPlayed', {
        tile: data.tile,
        room: data.room
      });
    });

    /**
     * Notify the players about the victor.
     */
    socket.on('gameEnded', function(data){
      socket.broadcast.to(data.room).emit('gameEnd', data);
    });
});
