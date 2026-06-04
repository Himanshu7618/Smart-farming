import jwt from "jsonwebtoken";
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

export default authMiddleware;