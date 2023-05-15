const messages = {}

export default function messageHandlers(io, socket) {
    const {roomId} = socket

    const updateMessageList = () => {
        io.to(roomId).emit('message_list:update', messages[roomId])
    }

    socket.on('message:get', async () => {
        updateMessageList()
    })

    socket.on('message:add', (message) => {

        message.createdAt = Date.now()

        messages[roomId]?.push(message)

        updateMessageList()
    })

}