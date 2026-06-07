const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklistToken.model');
module.exports.authUser = async (req, res, next) => {
  try {
    const token =(req.cookies.token ||  req.headers.authorization.split(' ')[1]);
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const isBlackListed = await blacklistTokenModel.findOne({ token:token });

    if (isBlackListed) {
      return res.status(401).json({ message: 'Invalid token. Token is blacklisted.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

