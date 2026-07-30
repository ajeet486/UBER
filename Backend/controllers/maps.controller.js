const mapsService = require("../services/map.service");
const { validationResult } = require("express-validator");
const { autoCompleteSuggestions } = require("../services/map.service");
module.exports.getCoordinates = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { address } = req.query;
  try {
    const coordinates = await mapsService.getAddressCoordinate(address);
    res.status(200).json(coordinates);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports.getDistanceTime = async (req, res) => {
  try {
    const { origin, destination } = req.query;

    // 1. Validate input
    if (!origin || !destination) {
      return res.status(400).json({
        message: "Origin and destination are required"
      });
    }

    // 2. Convert address → coordinates
    const o = await mapsService.getAddressCoordinate(origin);
    const d = await mapsService.getAddressCoordinate(destination);

    // console.log("ORIGIN:", o);
    // console.log("DEST:", d);

    // 3. Strict validation (VERY IMPORTANT)
    if (!o?.lat || !o?.lng || !d?.lat || !d?.lng) {
      return res.status(400).json({
        message: "Could not resolve coordinates for origin or destination"
      });
    }

    // 4. Safe format for routing API
    const originCoords = { lat: o.lat, lng: o.lng };
    const destCoords = { lat: d.lat, lng: d.lng };

    // 5. Get distance & time
    const distanceTime = await mapsService.getDistanceTime(
      originCoords,
      destCoords
    );

    // 6. Return response
    return res.status(200).json({
      success: true,
      data: distanceTime
    });

  } catch (error) {
    console.log("FULL ERROR:", error.response?.data || error.message);

    return res.status(500).json({
      message: error.response?.data?.message || error.message
    });
  }
};

module.exports.getAutoCompleteSuggestions = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation error",
        errors: errors.array()
      });
    }

    const { input } = req.query;

    if (!input) {
      return res.status(400).json({
        message: "input query is required"
      });
    }

    const suggestions = await mapsService.getAutoCompleteSuggestions(input);

    return res.status(200).json({
      success: true,
      data: suggestions
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error"
    });
  }
};

