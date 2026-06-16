const userModel = require("../models/user.model");
const captainModel = require("../models/captain.model");
const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklistToken.model");
module.exports.authUser = async (req, res, next) => {
  try {
    const token =
      (req.cookies && req.cookies.token) ||
      (req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(" ")[1]);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const isBlackListed = await blacklistTokenModel.findOne({ token: token });

    if (isBlackListed) {
      return res
        .status(401)
        .json({ message: "Invalid token. Token is blacklisted." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid token. User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports.authCaptain = async (req, res, next) => {
  try {
    const token =
      (req.cookies && req.cookies.token) ||
      (req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const isBlackListed = await blacklistTokenModel.findOne({ token: token });

    if (isBlackListed) {
      return res
        .status(401)
        .json({ message: "Invalid token. Token is blacklisted." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await captainModel
      .findById(decoded._id)
      .select("-password");
    if (!captain) {
      return res
        .status(401)
        .json({ message: "Invalid token. Captain not found." });
    }
    req.captain = captain;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};
