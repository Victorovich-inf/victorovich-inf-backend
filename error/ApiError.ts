// @ts-nocheck
export class ApiError extends Error{
    private status: number;
    constructor(status, message) {
        super();
        this.status = status
        this.message = message
    }

    static badRequest(message) {
        return new ApiError(404, message)
    }

    static internal(message) {
        return new ApiError(500, message)
    }

    static forbidden(message) {
        return new ApiError(403, message)
    }

    static noAuth(message) {
        return new ApiError(401, message)
    }
}
