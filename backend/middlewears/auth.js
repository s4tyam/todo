const jwt = require("jsonwebtoken");
const User = require("../models/user");

const Protect = async(req, res, next) => {
    try {
        const {token} = req.cookies;

        if(!token) {
            return res.status(400).json({
                success: false,
                message: "Login First"
            })
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decode._id);
        if (!user) {
        return res.status(200).json({ message: "No user found" });
        }
        req.user = user;
        next();
    }catch(error) {
        console.log(error);
        return res.status(200).json({message: "Internal server Error"});
    }
}

module.exports = Protect;