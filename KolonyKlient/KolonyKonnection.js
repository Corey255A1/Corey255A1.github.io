const sock = new WebSocket('ws://localhost:15648');

sock.addEventListener('open',function(event){
    sock.send('Hello World!');
});

sock.addEventListener('message',function(event){
    alert(event.data);
});

