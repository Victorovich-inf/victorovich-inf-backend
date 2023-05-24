import {Achievements, Statics, Subscription} from '../models'

export  const upsertAchievements = async (values, userId) => {
    const obj = await Achievements
        .findOne({
            where: {userId}
        })
    if (obj) {
        return obj.update(values);
    }
    return Achievements.create(values);
}

export  const upsertStatics = async (values, userId) => {
    const obj = await Statics
        .findOne({
            where: {userId}
        })
    if (obj) {
        return obj.update(values);
    }
    return Statics.create(values);
}

export const upsertSubscription = async (values, userId) => {
    const obj = await Subscription
        .findOne({
            where: {userId}
        })
    if (obj) {
        return obj.update(values);
    }
    return Statics.create(values);
}
