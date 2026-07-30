const express = require("express");
const { body, validationResult ,query} = require("express-validator");
const router = express.Router();

const rideController = require("../controllers/ride.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// 🔥 validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  "/create",

  authMiddleware.authUser,

  body("pickup")
    .isString()
    .isLength({ min: 3 })
    .notEmpty()
    .withMessage("pickup is required and should be a valid string"),

  body("destination")
    .isString()
    .isLength({ min: 3 })
    .notEmpty()
    .withMessage("destination is required and should be a valid string"),

  body("vehicleType")
    .isIn(["car", "auto", "motorcycle"])
    .withMessage("vehicleType must be one of car, auto, or motorcycle"),

  validateRequest,   

  rideController.createRide
);

router.get('/get-fare', authMiddleware.authUser, 
  query('pickup').isString().isLength({ min: 3 }).notEmpty().withMessage('pickup is required and should be a valid string'),
  query('destination').isString().isLength({ min: 3 }).notEmpty().withMessage('destination is required and should be a valid string'),
  
  validateRequest,
  rideController.getFare
);
  
router.post('/confirm',authMiddleware.authCaptain,
  body('rideId').isMongoId().withMessage('rideId must be a valid MongoDB ObjectId'),
rideController.confirmRide);


router.get('/start-ride',authMiddleware.authCaptain,
  query('rideId').isMongoId().withMessage('Invalid ride id'),
  query('otp').isString().isLength({min:6,max:6}).withMessage('Invalid otp'),
  rideController.startRide
);


router.post('/end-ride',authMiddleware.authCaptain,
  body('rideId').isMongoId().withMessage('Invalid ride id'),
  // body('otp').isString().isLength({min:6,max:6}).withMessage('Invalid otp'),
  rideController.endRide
)



module.exports = router;