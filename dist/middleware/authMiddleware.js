"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
// @ts-nocheck
const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 1) {
        next();
    }
    else {
        res.status(403).json({
            message: 'Вы не администратор',
        });
    }
};
exports.adminMiddleware = adminMiddleware;
//# sourceMappingURL=authMiddleware.js.map