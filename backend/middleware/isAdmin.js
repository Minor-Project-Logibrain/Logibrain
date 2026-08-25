const isAdmin = async (req, res, next) => {
    console.log("USER:", req.user);
    console.log("ROLE:", req.user.role);
    if (req.user.role !== "Owner") {
        return res.status(403).json({ success: false, message: "only owner can access this route" })
    }
    next();
}

export default isAdmin;