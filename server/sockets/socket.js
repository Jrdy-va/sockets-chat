const { io } = require('../server');
const { Usuario } = require('../classes/usuarios')
const usuario = new Usuario()

const { crearMensaje} = require('../utils/utils')

io.on('connection', (client) => {

    console.log('Usuario conectado ', client.id );
   
    client.on('entrarChat', ( data, callback) => {
        
        if( !data.nombre || !data.sala) {
            return callback({
                err: true,
                mensaje: 'El nombre y la sala son necesarios'
            })
        }

        client.join(data.sala)

        let usuarios = usuario.agregarPersona( client.id, data.nombre, data.sala )
         

         //client.broadcast.emit('notificarMensaje', { usuario: 'Admin', mensaje: `El usuario ${data.nombre} se ha unido a la sala` })
         client.broadcast.to(data.sala).emit('notificarMensaje', crearMensaje('Admin', `El usuario ${data.nombre} se unió`) )

         client.broadcast.to(data.sala).emit('groupDetail', usuario.getPersonasBySala(data.sala))
         
         callback ( usuario.getPersonasBySala(data.sala) )
    
        } )

    client.on('disconnect', ()  => {

        let usuarioExpulsado = usuario.removePersonainSala(client.id)  
        
        //client.broadcast.emit('notificarMensaje', { usuario: 'Admin', mensaje: `El usuario ${usuarioExpulsado.nombre} ha abandonado la sala` })
        client.broadcast.to(usuarioExpulsado.sala).emit('notificarMensaje', crearMensaje('Admin', `El usuario ${usuarioExpulsado.nombre} salió`) )
    
        client.broadcast.to(usuarioExpulsado.sala).emit('groupDetail', usuario.getPersonasBySala(usuarioExpulsado.sala))
    
    })

    client.on('notificarMensaje', ( data, callback ) => {

        let persona = usuario.getPersonaById( client.id )

        let mensaje = crearMensaje(persona.nombre, data.mensaje)
        client.broadcast.to(persona.sala).emit('notificarMensaje', mensaje)

        callback (mensaje)

    })

    //mensaje dirigido
    client.on('mensajeDirigido', ( data ) => {
    
        let persona = usuario.getPersonaById( client.id )
        
        client.broadcast.to(data.to).emit('notificarMensaje', crearMensaje( persona.nombre,  data.mensaje))

    })

    client.on('mensajeGrupal', ( data ) => {
    
        let persona = usuario.getPersonaById( client.id )
        
        client.broadcast.to(persona.sala).emit('notificarMensaje', crearMensaje( persona.nombre,  data.mensaje))

    })


});


/* io.on('entrarChat', data => {
    console.log(data)
} ) */