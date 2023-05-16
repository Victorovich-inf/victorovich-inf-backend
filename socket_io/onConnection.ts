import messageHandlers from './handlers/message.handlers.ts'
import userHandlers from './handlers/user.handlers'

export default function onConnection(io, socket) {
    const { roomId, userName } = socket.handshake.query

    if (roomId) {
        socket.roomId = roomId
        socket.userName = userName

        socket.join(roomId)

        messageHandlers(io, socket)
        userHandlers(io, socket)
    }
}