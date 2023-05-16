import {Message, User} from '../../models'

const messages = {}

export default function messageHandlers(io, socket) {
    const {roomId} = socket

    const updateMessageList = () => {
        io.to(roomId).emit('message_list:update', messages[roomId])
    }

    socket.on('message:get', async () => {
        if (roomId) {
            messages[roomId] = await Message.findAll({
                where: {chatId: roomId}, distinct: true,
                include: [
                    {
                        model: User,
                        as: 'sender'
                    },
                    {
                        model: User,
                        as: 'recipient'
                    }
                ],
            })
            updateMessageList()
        }
    })

    socket.on('message:add', async (message) => {
        const created = await Message.create(message)

        const createdMessage = await Message.findOne({
            where: {id: created.id}, distinct: true,
            include: [
                {
                    model: User,
                    as: 'sender'
                },
                {
                    model: User,
                    as: 'recipient'
                }
            ],
        })

        messages[roomId]?.push(createdMessage)

        updateMessageList()
    })

}