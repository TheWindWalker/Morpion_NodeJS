//Code javascript de gestion des sockets
var socket = io.connect('http://10.0.2.15:8080');
socket.on('connect', function()
{
    var pseudo = prompt("Veuillez choisir un pseudo :");
    if ((pseudo)&&(pseudo!=""))
    {
        socket.emit('login', pseudo);
    }
});
socket.on('connect_success',function(connect_message)
{
    alert("Vous êtes connecté en tant que: "+connect_message);

    var message = prompt("Votre message:");
    if ((message)&&(message!=""))
    {
        socket.emit('message', message);
    }
});
socket.on('reponse',function(result){
    //var div_conv= document.getElementById("conversation");
    //var contenu = div_conv.innerHTML;
    //var ajout = "</br><div><h1>"+pseudo+"</h1><br><p>"+result+"</p></div></br>";
    //div_conv.innerHTML=contenu+ajout;
});
socket.on('message',function(message){
    //var div_conv= document.getElementById("conversation");
    //var contenu = div_conv.innerHTML;
    //var ajout = "</br><div><h1>"+"Quelqu'un"+"</h1><br><p>"+result+"</p></div></br>";
    //div_conv.innerHTML=contenu+ajout;
});
//Check code erreur ou validation
socket.on('code', function(message)
{
    switch (message.code) {
        case "CONNECT_FAILED" :
        {
            alert("Erreur connexion : "+message.reason);
            window.location.reload(false);
            var pseudo = prompt("Veuillez choisir un pseudo :");
            socket.emit('login', pseudo);
            break;
        }
        default:
        {
            break;
        }

    }
});
//Code javascript
