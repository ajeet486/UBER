const rideService = require("../services/ride.service");
const { validationResult } = require("express-validator");
const mapService = require("../services/map.service");
const rideModel = require("../models/ride.model");
const captainModel = require("../models/captain.model");
const userModel = require("../models/user.model");
const { sendMessage } = require("../socket");

module.exports.createRide = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination, vehicleType } = req.body;
  try {
    const ride = await rideService.createRide({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
    });

    const pickupCoords = await mapService.getAddressCoordinate(pickup);
    // console.log("Pickup Coordinates:", pickupCoords);
    const captainsInRadius = await mapService.getCaptainsInRadius(
      pickupCoords.lat,
      pickupCoords.lng,
      4,
    );

    const rideWithUser = await rideModel
      .findById(ride._id)
      .populate("user")
      .select("-otp");
    const rideForCaptain = rideWithUser?.toObject
      ? rideWithUser.toObject()
      : rideWithUser;

    if (rideForCaptain) {
      delete rideForCaptain.otp;
    }

    const captainsToNotify =
      captainsInRadius.length > 0
        ? captainsInRadius.filter((captain) => captain.socketId)
        : await captainModel.find({ status: "active" }).select("socketId");

    captainsToNotify.forEach((captain) => {
      sendMessage(captain.socketId, {
        event: "new-ride",
        data: rideForCaptain,
      });
    });
    return res.status(201).json(ride);
  } catch (error) {
    // console.log("error",error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getFare = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination } = req.query;
  try {
    const fare = await rideService.getFare(pickup, destination);
    return res.status(200).json({ fare });
  } catch (error) {
    console.error("Error calculating fare:", error);
    return res.status(500).json({ message: "Error calculating fare" });
  }
};

module.exports.confirmRide = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { rideId } = req.body;
  try {
    const ride = await rideService.confirmRide({
      rideId,
      captain: req.captain,
    });

    let socketIdToNotify = ride.user?.socketId;
    if (!socketIdToNotify && ride.user?._id) {
      const user = await userModel.findById(ride.user._id).select("socketId");
      socketIdToNotify = user?.socketId;
    }

    if (socketIdToNotify) {
      sendMessage(socketIdToNotify, {
        event: "ride-confirmed",
        data: ride,
      });
    } else {
      console.warn(
        "ride.controller.confirmRide: no socketId found for ride user",
        ride.user?._id,
      );
    }
    res.status(200).json({ message: "Ride confirmed successfully", ride });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.startRide = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { rideId, otp } = req.query;
  try {
    const ride = await rideService.startRide({
      rideId,
      otp,
      captain: req.captain,
    });

    sendMessage(ride.user.socketId, {
      event: "ride-started",
      data: ride,
    });
    return res.status(200).json(ride);
  } catch (err) {
    console.error("startRide error", err);
    const clientErrors = [
      "ride is not accepted",
      "Invalid otp",
      "Ride not found",
      "Ride id and otp are required",
    ];
    const status = clientErrors.some((msg) =>
      err.message.toLowerCase().includes(msg.toLowerCase()),
    )
      ? 400
      : 500;
    return res.status(status).json({ message: err.message });
  }
};

module.exports.endRide=async (req,res)=>{
const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const {rideId}=req.body;
  try{
    const ride=await rideService.endRide({rideId,captain:req.captain})
    sendMessage(ride.user.socketId,{
      event:'ride-ended',
      data:ride
    })

    return res.status(200).json(ride)
  }
  catch(err){
    return res.status(500).json({messages:err.message})
  }

}
