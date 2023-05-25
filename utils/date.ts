import dayjs from 'dayjs';

export const checkActiveSubscription = (end: string) => {
    let now = dayjs()
    return now < dayjs(end);
}