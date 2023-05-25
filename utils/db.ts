// @ts-nocheck
import {Achievements, Statics} from '../models'

export  const upsertAchievements = async (values: any, userId: any) => {
    const obj = await Achievements
        .findOne({
            where: {userId}
        })
    if (obj) {
        return obj.update(values);
    }
    return Achievements.create(values);
}

export  const upsertStatics = async (values: any, userId: any) => {
    const obj = await Statics
        .findOne({
            where: {userId}
        })
    if (obj) {
        return obj.update(values);
    }
    return Statics.create(values);
}
