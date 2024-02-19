const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) =>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    //make sure token exits
    if(!token){
        return res.status(401).json({success: false, message:'Not authorize to access this route'});
    }

    //verify token
    try{
        const decoded = jwt.verify(token, precess.env.JWT_SECRET);

        console.log(decoded);

        req.user = await User.findById(decoded.id);

        next();
    }catch (err){
        console.log(err.stack);
        return res.status(401).json({success: false, message:'Not authorize to access this route'});
    }
}