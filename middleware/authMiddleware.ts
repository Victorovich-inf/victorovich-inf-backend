// @ts-nocheck
const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 1) {
        next()
    } else {
        res.status(403).json({
            message: 'Вы не администратор',
        });
    }
}

export {adminMiddleware}