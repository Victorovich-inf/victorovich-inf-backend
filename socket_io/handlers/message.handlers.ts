import {Message, User, Notification} from '../../models'
import {removeFile} from "../../utils/file";

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

        await Notification.create({
            userId: message.recipientId,
            text: `${createdMessage.sender.firstName} ${createdMessage.sender.lastName} написал Вам сообщение`
        })

        messages[roomId]?.push(createdMessage)

        updateMessageList()
    })

    socket.on('message:remove', async (message) => {
        const {id, path} = message

        await Message.destroy({where: {id}})

        if (path)
            await removeFile(path)

        messages[roomId] = messages[roomId]?.filter((m) => m.id !== id)

        updateMessageList()
    })

}