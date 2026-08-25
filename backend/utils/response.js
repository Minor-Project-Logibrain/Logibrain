export const sendError = (res, status, message, err = null) => {
    return res.status(status).json({
        success: false,
        message: message,
        data: err,
    });
};


export const sendSuccess = (res, status, message, result = null) => {
    return res.status(status).json({
        success: true,
        message: message,
        result,
    });
};