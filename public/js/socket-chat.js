var socket = io();

var params = new URLSearchParams ( window.location.search )

if ( !params.has('nombre')  || !params.has('sala')) {
    window.location = 'index.html'
    throw new Error('El nombre y la sala son necesarios')
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario , function ( resp ) {
        console.log( 'Usuario conectados ', resp);
        renderizarUsuarios(resp )
    })

});

// escuchar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');    
});

// Enviar información
/* socket.emit('crearMensaje', {
    nombre: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
}); */

// Escuchar información del admin
socket.on('notificarMensaje', function(mensaje) {
    console.log('Servidor:', mensaje);
    renderizarMensajes(mensaje, false)
    scrollBottom()
});

// Listado final de usuarios en la sala despues de un evento
socket.on('groupDetail', function( listPersonsInGroup ) {
    console.log('Usuarios conectados : ', listPersonsInGroup);
    renderizarUsuarios( listPersonsInGroup )
});

// mensajes a una persona 
socket.on('mensajeDirigido', function( mensaje ) {
    console.log( 'Mensaje a una persona ', mensaje);
    
})