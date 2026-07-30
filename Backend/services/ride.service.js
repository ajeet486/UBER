const rideModel = require("../models/ride.model");
const mapsService = require("../services/map.service");
const { getDistanceTime } = require("../controllers/maps.controller");
const { sendMessage } = require("../socket");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required to calculate fare");
  }
  // console.log("hello")
  const origin = await mapsService.getAddressCoordinate(pickup);
  const dest = await mapsService.getAddressCoordinate(destination);

  const distanceTime = await mapsService.getDistanceTime(origin, dest);

  // console.log("Distance & Time:", distanceTime);

  const distanceKm = distanceTime.distance / 1000;
  const timeMin = distanceTime.duration / 60;
  // console.log(`Distance: ${distanceKm} km, Duration: ${timeMin} min`);

  const pricing = {
    car: { baseFare: 50, ratePerKm: 12, ratePerMin: 1 },
    auto: { baseFare: 30, ratePerKm: 8, ratePerMin: 0.5 },
    motorcycle: { baseFare: 20, ratePerKm: 5, ratePerMin: 0.3 },
  };

  const result = {};

  for (let vehicle in pricing) {
    const { baseFare, ratePerKm, ratePerMin } = pricing[vehicle];

    const fare = baseFare + distanceKm * ratePerKm + timeMin * ratePerMin;

    result[vehicle] = Math.round(fare);
  }

  return result;
}

module.exports.getFare = getFare;

async function getOtp(num) {
  const otp = crypto
    .randomInt(Math.pow(10, num - 1), Math.pow(10, num))
    .toString();
  return otp;
}

module.exports.createRide = async ({
  user,
  pickup,
  destination,
  vehicleType,
}) => {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error("User, pickup, destination, and vehicle type are required");
  }

  const fare = await getFare(pickup, destination);

  const ride = await rideModel.create({
    user,
    pickup,
    destination,
    otp: await getOtp(6),
    fare: fare[vehicleType],
    status: "pending",
  });

  return rideModel.findById(ride._id).select("+otp");
};

module.exports.confirmRide = async ({ rideId, captain }) => {

  console.log("confirmed called",rideId);


  if (!rideId) {
    throw new Error("rideId is required");
  }

  await rideModel.findOneAndUpdate(
    { _id: rideId },
    {
      status: "accepted",
      captain,
    },
  );


  
  const ride = await rideModel
    .findOne({ _id: rideId })
    .populate("user")
    .populate("captain")
    .select("+otp");

    console.log(ride.status);
  if (!ride) {
    throw new Error("Ride not found");
  }

  return ride;
};

module.exports.startRide=async ({rideId,otp,captain})=>{
  if(!rideId || !otp) throw new Error('Ride id and otp are required')

    const ride=await rideModel.findOne({_id:rideId}).populate('user').populate('captain').select('+otp')


    if(!ride) throw new Error('Ride not found')

      if(ride.status!=='accepted') throw new Error('ride is not accepted');

      if(ride.otp!==otp) throw new Error("Invalid otp")



      const updatedRide = await rideModel
    .findByIdAndUpdate(
      rideId,
      { status: "ongoing" },
      { new: true }
    )
    .populate("user")
    .populate("captain")
    .select("+otp");

    

        return ride;
};

module.exports.endRide=async({rideId,captain})=>{
  if(!rideId) throw new Error('ride id is required')
    const ride=await rideModel.findOne({_id:rideId,captain:captain._id}).populate('user').populate('captain').select('+otp')

  if(!ride) throw new Error('ride is not found')

    if(ride.status!=='ongoing') throw new Error('ride is not ongoing')

      await rideModel.findOneAndUpdate({_id:rideId},{status:'completed'})

      return ride
}
