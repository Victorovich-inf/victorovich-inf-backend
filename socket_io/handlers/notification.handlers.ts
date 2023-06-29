// @ts-nocheck
import {Notification, CourseUser, Course} from '../../models'
import dayjs from 'dayjs';

export default function notificationHandlers(io, socket) {
    const {userId} = socket

    setInterval(async function () {
        if (userId) {
            const notifications = await Notification.findAll({where: {userId}, order: [['createdAt', 'DESC']]})

            socket.emit("notification", {
                notifications
            });


        }
    }, 10000)

    setInterval(async function () {
        if (userId) {
            const courseUser = await CourseUser.findOne({
                where: {userId, completed: true}, include: {
                    model: Course
                }
            });

            if (courseUser.end) {
                let now = dayjs();
                let end = dayjs(courseUser.end);

                let diff = end.diff(now, 'day')

                if (diff > 0) {
                    if (diff < 10) {

                        const obj = await Notification.findOne({where: {text: `Пожалуйста, продлите оплату за курс "${courseUser.Course.name}", осталось меньше 10 дней до окончания подписки`}})

                        if (!obj) {
                            await Notification.create({
                                userId: userId,
                                text: `Пожалуйста, продлите оплату за курс "${courseUser.Course.name}", осталось меньше 10 дней до окончания подписки`
                            })

                            const notifications = await Notification.findAll({
                                where: {userId},
                                order: [['createdAt', 'DESC']]
                            })

                            socket.emit("notification", {
                                notifications
                            });
                        }

                    }
                }
            }
        }
    }, 43200000);


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