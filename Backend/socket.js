const socketIo = require("socket.io");
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");
const rideModel = require("./models/ride.model");
let io;

function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });


  io.on("connection", (socket) => {
    
    // console.log(`A user connected : ${socket.id}`);

    socket.on("join", async (data) => {
      const { userId, userType } = data;
  
      if (userType === "user") {
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
      } else if (userType === "captain") {
        await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
      }
    });

    socket.on("ride-accepted", async (data) => {
      const { userId, ride } = data;

      if (!userId) return;

      const user = await userModel.findById(userId).select("socketId");
      let ridePayload = ride;

      if (ride?._id) {
        const rideDoc = await rideModel
          .findById(ride._id)
          .populate("user")
          .populate("captain")
          .select("+otp");

        if (rideDoc) {
          const plainRide = rideDoc.toObject();
          plainRide.captainDetails = plainRide.captain
            ? rideDoc.captain.toObject()
            : null;
          ridePayload = plainRide;
        }
      }
    
      if (user?.socketId) {
        sendMessage(user.socketId, {
          event: "ride-accepted",
          data: ridePayload,
        });
      }
    });

    socket.on("update-location-captain", async (data) => {
      const { userId, location } = data;
      if (
        !location ||
        location.lat === undefined ||
        location.lng === undefined
      ) {
        return socket.emit("error", "Invalid location data");
      }

      return await captainModel.findByIdAndUpdate(userId, {
        location: {
          lat: location.lat,
          lng: location.lng,
        },
      });
    });

    socket.on("disconnect", () => {
      console.log(`A user disconnected : ${socket.id}`);
    });
  });
}

function sendMessage(socketId, messageObject) {
  console.log(messageObject.data);
  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log("Socket.io is not initialized. Cannot send message.");
  }
}

module.exports = { initializeSocket, sendMessage };
