// @ts-nocheck
import {CourseUser, Lesson, Achievements, Task, Content, Statics} from '../models'
import {upsertAchievements} from "./db";

const dataToContent = (data) => {
    const content = {};

    data.map(el => {
        if (el.Tasks?.length) {
            el.Tasks?.map(task => {
                content[`${task.id}_task`] = {
                    elements: task.Content.content,
                    public: task.public,
                };
            });

            content[`${el.id}_lesson`] = {
                elements: el.Content.content,
                public: el.public,
            };
        }
    });

    return content;
};

const calculateProgress = (data, all: number) => {
    let percent = 0;
    let count = 0;

    Object.keys(data).map(el => {
        if (data[el].viewed) {
            count = count + 1;
            data[el].Tasks.map(el => {
                if (el.correctly) {
                    count = count + 1;
                }
            });
        }
    });

    percent = +(count / all * 100).toFixed(0);

    return percent;
};


export const checkCompletedCourse = async (answerData, courseId: string, userId: string) => {

    const find = await Achievements
        .findOne({
            where: {userId, completedCourse: true}
        })

    if (find) {
        return
    }

    const lessons = await Lesson.findAll({
        where: {courseId}, include:
            [
                {
                    model: Task,
                    include: [
                        {
                            model: Content
                        },
                        {
                            model: Lesson
                        }
                    ]
                },
                {
                    model: Content
                }
            ]
    });

    const content = dataToContent(lessons);

    let all = Object.keys(content).filter(el => content[el].public).length;

    const percent = calculateProgress(JSON.parse(answerData), all);

    if (percent > 99) {
        await upsertAchievements({completedCourse: true, userId}, userId)
    }

}


export const checkCorrectlyCompletedTasksAndWinningStreak = async (userId: string) => {

    const find = await Statics
        .findOne({
            where: {userId}
        })

    if (find) {

        let correctlyCompletedTasks = +find?.correctlyCompletedTasks + 1;
        let winningStreak = +find?.winningStreak + 1;

        await find.update({correctlyCompletedTasks, winningStreak, userId})

        switch (correctlyCompletedTasks) {
            case 10: {
                await upsertAchievements({correctTasks10: true, userId}, userId)
                break;
            }
            case 25: {
                await upsertAchievements({correctTasks25: true, userId}, userId);
                break;
            }
            case 50: {
                await upsertAchievements({correctTasks50: true, userId}, userId);
                break;
            }
            case 100: {
                await upsertAchievements({correctTasks100: true, userId}, userId);
                break;
            }
        }
        switch (winningStreak) {
            case 5: {
                await upsertAchievements({winningStreak5: true, userId}, userId)
                break;
            }
            case 10: {
                await upsertAchievements({winningStreak10: true, userId}, userId);
                break;
            }
            case 15: {
                await upsertAchievements({winningStreak15: true, userId}, userId);
                break;
            }
            case 25: {
                await upsertAchievements({winningStreak25: true, userId}, userId);
                break;
            }
        }

    } else {
        await Statics.create({correctlyCompletedTasks: 1, winningStreak: 1, userId})
    }

}