const express = require("express");
const router = express.Router();

const { query } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middleware");
const {
    getCoordinates,
    getDistanceTime,
    getAutoCompleteSuggestions
} = require("../controllers/maps.controller");

router.get(
    "/get-coordinates",
    query("address").isString().isLength({ min: 3 }),
    authMiddleware.authUser,
    getCoordinates
);

router.get(
    "/get-distance-time",
    query("origin").notEmpty(),
    query("destination").notEmpty(),
    authMiddleware.authUser,
    getDistanceTime
);


router.get(
    "/get--suggestions",
    query("input").isString().isLength({ min: 3 }),
    authMiddleware.authUser,
    getAutoCompleteSuggestions
);
module.exports = router;