export const sendError = (res, status, message, data = null) => {
    return res.status(status).json({
        success: false,
        message: message,
        data,
    });
};


export const sendSuccess = (res, status, message, err = null) => {
    return res.status(status).json({
        success: true,
        message: message,
        err,
    });
};