
const isProduction = process.env.NODE_ENV === "production";
const TOKEN_AGE = 7 * 24 * 60 * 60 * 1000;
const INFO_COOKIE_AGE = 5 * 24 * 60 * 60 * 1000;
const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
};

export const setTokenCookie = (res, token) => {
    res.cookie("token", token, {
        ...cookieOptions,
        maxAge: TOKEN_AGE,
    });
};



export const setEmailCookie = (res, email) => {
    res.cookie("email", email, {
        ...cookieOptions,
        maxAge: INFO_COOKIE_AGE,
    });
};

export const clearTokenCookie = (res) => {
    res.clearCookie("token", cookieOptions);
};

export const clearEmailCookie = (res) => {
    res.clearCookie("email", cookieOptions);
};