import messageHandlers from './handlers/message.handlers.ts'
import userHandlers from './handlers/user.handlers'
import notificationHandlers from './handlers/notification.handlers'



export default function onConnection(io, socket) {
    const { roomId, userName, userId } = socket.handshake.query


    if (userId) {
        socket.userId = userId
        notificationHandlers(io, socket)
    }

    if (roomId) {

        socket.roomId = roomId
        socket.userName = userName

        socket.join(roomId)

        messageHandlers(io, socket)
        userHandlers(io, socket)
    }

    socket.on('disconnect', () => {
        console.log('disconnect')
        socket.disconnect();
    })
}