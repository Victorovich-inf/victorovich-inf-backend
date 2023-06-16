// @ts-nocheck
import {Notification} from '../../models'
import {removeFile} from "../../utils/file";

export default function notificationHandlers(io, socket) {
    const {userId} = socket

     setInterval(async function () {
        if (userId) {
            const notifications = await Notification.findAll({where: {userId}, order: [['createdAt', 'DESC']]})

            socket.emit("notification", {
                notifications
            });


        }
    }, 500000);


    socket.on('notification:remove', async (message) => {
        const {id} = message

        await Notification.destroy({where: {id}})

        const notifications = await Notification.findAll({where: {userId}, order: [['createdAt', 'DESC']]})

        socket.emit("notification", {
            notifications
        });
    })

    socket.on('notification:clear', async () => {
        await Notification.destroy({where: {userId}})

        socket.emit("notification", {
            notifications: []
        });
    })
}