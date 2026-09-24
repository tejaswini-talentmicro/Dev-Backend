import jwt from 'jsonwebtoken';
import User from '../models/user.js';


const authMiddleware = async (req, res, next) => {
    const {token} = req.cookies;
    if (!token) {
        return res.status(401).send("Access denied. No token provided.");
    }

    try {
        const decodedMessage = await jwt.verify(token, 'secretKey');
        const {id} = decodedMessage;
        const user = await User.findById(id);
        if (!user) {
            return res.status(401).send("User does not exist.");
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(400).send("Invalid token: " + error.message);
    }
    
}

export default authMiddleware;